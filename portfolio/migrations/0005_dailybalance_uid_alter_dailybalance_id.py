# Generated by Django 5.0.6 on 2024-07-13 18:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0004_dailybalance'),
    ]

    operations = [
        migrations.AddField(
            model_name='dailybalance',
            name='uid',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='portfolio.portfolio'),
        ),
        migrations.AlterField(
            model_name='dailybalance',
            name='id',
            field=models.BigAutoField(primary_key=True, serialize=False),
        ),
    ]
