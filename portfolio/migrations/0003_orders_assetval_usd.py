# Generated by Django 5.0.6 on 2024-07-13 11:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0002_portfolio_orders'),
    ]

    operations = [
        migrations.AddField(
            model_name='orders',
            name='assetval_usd',
            field=models.FloatField(default=0, editable=False),
        ),
    ]
