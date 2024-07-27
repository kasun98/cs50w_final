from . import views
from django.urls import path

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("portfolio", views.portfolio, name="portfolio"),
    path("market", views.market, name="market"),
    path("orders", views.history, name="orders"),

    # APIs
    path("transactions", views.transactions, name="transactions"),
    path('get-orders-data/', views.get_orders_data, name='get_orders_data'),
    
]