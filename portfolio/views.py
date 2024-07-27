import json
import os
from django.core.paginator import Paginator
from django.contrib import messages
from django.db import IntegrityError
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect
from django.views.decorators.http import require_http_methods
from django.shortcuts import HttpResponse, HttpResponseRedirect, render, get_object_or_404, redirect
from django.http import JsonResponse
import requests
from datetime import datetime, date
from django.contrib.auth.models import User
from django.db.models import Sum
from django.db.models.functions import TruncDate

from .models import User, Portfolio, Orders


def index(request):
    today = datetime.now().strftime('%A')
    if today in ['Saturday', 'Sunday']:
        messages.success(request, f'Live market will open on Monday!')
    rates = get_exchange_rate()

    if request.user.id:
        account = Portfolio.objects.get(portfolio_id=request.user)
        orders = Orders.objects.filter(order_id=account).order_by('-datetime')[:4]
        return render(request, "portfolio/index.html", {"rates":rates,
                                                        "orders":orders})
    return render(request, "portfolio/login.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "portfolio/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "portfolio/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]

        if password != confirmation:
            return render(request, "portfolio/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            portfolio = Portfolio.objects.create(portfolio_id=user)
            user.save()
            portfolio.save()
            
        except IntegrityError:
            return render(request, "portfolio/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    
    else:
        return render(request, "portfolio/register.html")


def market(request):
    today = datetime.now().strftime('%A')
    if today in ['Saturday', 'Sunday']:
        messages.success(request, f'Live market will open on Monday!')
    rates = get_exchange_rate()   
    return render(request, "portfolio/market.html", {"rates":rates})


def history(request):
    today = datetime.now().strftime('%A')
    if today in ['Saturday', 'Sunday']:
        messages.success(request, f'Live market will open on Monday!')
    account = Portfolio.objects.get(portfolio_id=request.user)
    orders = Orders.objects.filter(order_id=account).order_by('-datetime').all()

    paginator = Paginator(orders, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    if request.user.id:
        return render(request, "portfolio/history.html", {
                                                        "orders":page_obj
                                                        })
    return render(request, "portfolio/login.html")


def portfolio(request):
    if request.user.id:
        today = datetime.now().strftime('%A')
        if today in ['Saturday', 'Sunday']:
            messages.success(request, f'Live market will open on Monday!')

        portfolio = Portfolio.objects.get(portfolio_id=request.user)
        
        order = {"USD":Orders.average_buying_price('USD'),
                    "EUR":Orders.average_buying_price('EUR'),
                    "GBP":Orders.average_buying_price('GBP'),
                    "JPY":Orders.average_buying_price('JPY'),
                    "CHF":Orders.average_buying_price('CHF'),
                    "AUD":Orders.average_buying_price('AUD'),
                    "NZD":Orders.average_buying_price('NZD'),
                    "CAD":Orders.average_buying_price('CAD'),
                    "PLN":Orders.average_buying_price('PLN'),
                    }
        
        rates = get_exchange_rate()
        history = Orders.objects.filter(order_id=portfolio).order_by('-datetime')[:8]
        
        
        return render(request, "portfolio/portfolio.html", {
            "portfolio":portfolio.data,
            "order":order,
            "rates":rates,
            "orders":history,
        })
    return render(request, "portfolio/login.html")



@csrf_exempt
@login_required
def transactions(request):
    try:
        account = Portfolio.objects.get(portfolio_id=request.user)
        portfolio = account.data
    except :
        return JsonResponse({"error": "portfolio not found."}, status=404)
    
    if request.method == "GET":
        return JsonResponse(account.serialize())

    elif request.method == "PUT":
        data = json.loads(request.body)
        if data is not None:
            list1 = ["USD","GBP","EUR","AUD","NZD"]
            list2 = ["JPY","CHF","CAD","PLN"]

            if data["asset"] in list1:
                usd_val = data["usd_val"]
            elif data["asset"] in list2:
                usd_val = 1/float(data["usd_val"])

            order = Orders.objects.create(order_id=account,
                                        type = data["type"],
                                        asset = data["asset"],
                                        value = data["value"],
                                        usd_value = usd_val,
                                        )
            
            if data["type"]==False  and account.get_asset(data["asset"]) != None:
                if float(data["value"]) > float(account.get_asset(data["asset"])):
                    return HttpResponse(status=205)
                account.update_rem_asset(data["asset"], data["value"])

            elif data["type"]==False and account.get_asset(data["asset"]) != None:
                account.update_rem_asset(data["asset"], data["value"])

            elif data["type"]==True and account.get_asset(data["asset"]) != None:
                account.update_add_asset(data["asset"], data["value"])
        
            elif data["type"]==True and account.get_asset(data["asset"]) == None:
                account.add_asset(data["asset"], float(data["value"]))
            
            account.save()
            order.save()
            return HttpResponse(status=204)

    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)


def get_exchange_rate():
    today = datetime.now().strftime('%A')
    day = date.today()
    formatted_date = day.strftime("%Y-%m-%d")
    try:
        api_key = '094bf53ab6f13d6db01be437'
        url = f'https://v6.exchangerate-api.com/v6/{api_key}/latest/USD'

        rates_dir = 'rates'
        if not os.path.exists(rates_dir):
            os.makedirs(rates_dir)

        file_path = os.path.join(rates_dir, f"{formatted_date}_rates.json")
        try:
            print("Cached")
            with open(file_path, 'r') as json_file:
                conversion_rates = json.load(json_file)
                return conversion_rates
        except:
            print("API request")
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                if data['result'] == 'success':
                    conversion_rates = data['conversion_rates']
                    with open(file_path, 'w') as json_file:
                        json.dump(conversion_rates, json_file)
                    return conversion_rates
                else:
                    raise Exception(f"Error fetching exchange rate: {data['error-type']}")
            else:
                response.raise_for_status()
    except:
        return None
    

@require_http_methods(["GET"])
def get_orders_data(request):
    account = Portfolio.objects.get(portfolio_id=request.user)
    buy_orders = Orders.objects.filter(order_id=account, type=True)
    sell_orders = Orders.objects.filter(order_id=account, type=False)
    
    buy_orders_data = [order.serialize() for order in buy_orders]
    sell_orders_data = [order.serialize() for order in sell_orders]
    
    return JsonResponse({'buy_orders': buy_orders_data, 'sell_orders': sell_orders_data})


