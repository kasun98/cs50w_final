from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Sum, F

class User(AbstractUser):
    pass

class Portfolio(models.Model):
    id = models.BigAutoField(primary_key=True)
    portfolio_id = models.ForeignKey("User", on_delete=models.CASCADE)
    data = models.JSONField(default=dict)
    
    def serialize(self):
        return {
            "id": self.id,
            "portfolio_id":self.portfolio_id.id,
            "data":self.data,
        }

    def add_asset(self, key, value):
        """Add a new asset to the dictionary."""
        self.data[key] = value
        self.save()

    def remove_asset(self, key):
        """Remove an asset from the dictionary."""
        if key in self.data:
            del self.data[key]
            self.save()
        else:
            raise KeyError(f"Key '{key}' not found in the assets.")

    def update_add_asset(self, key, value):
        """Update the value of an existing asset."""
        if key in self.data:
            self.data[key] = float(self.data[key]) + float(value)
            self.save()
        else:
            raise KeyError(f"Key '{key}' not found in the assets.")
    
    def update_rem_asset(self, key, value):
        """Update the value of an existing asset."""
        if key in self.data:
            self.data[key] = float(self.data[key]) - float(value)
            self.save()
        else:
            raise KeyError(f"Key '{key}' not found in the assets.")

    def get_asset(self, key):
        """Retrieve the value of an asset."""
        return self.data.get(key, None)
    
class Orders(models.Model):
    id = models.BigAutoField(primary_key=True)
    order_id = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    type = models.BooleanField() #True(Buy) False(Sell)
    asset = models.CharField(max_length=3)
    value = models.FloatField()
    usd_value = models.FloatField()
    assetval_usd = models.FloatField(default=0 ,editable=False)
    datetime = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "order_id":self.order_id.id,
            "type":self.type,
            "asset":self.asset,
            "value":self.value,
            "usd_value": self.usd_value,
            "assetval_usd": self.assetval_usd,
            "datetime":self.datetime.strftime("%b %d %Y, %I:%M %p"),
        }
    
    def save(self, *args, **kwargs):
        self.assetval_usd = float(self.value) * float(self.usd_value)
        super(Orders, self).save(*args, **kwargs)

    @classmethod
    def average_buying_price(cls, asset):
        buy_orders = cls.objects.filter(type=True, asset=asset)
        total_assetval_usd = buy_orders.aggregate(total_assetval_usd=Sum('assetval_usd'))['total_assetval_usd']
        total_value = buy_orders.aggregate(total_value=Sum('value'))['total_value']
        if total_value:
            return total_assetval_usd / total_value
        return None
    
