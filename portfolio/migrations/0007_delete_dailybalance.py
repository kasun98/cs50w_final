# Generated by Django 5.0.6 on 2024-07-13 19:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0006_remove_dailybalance_uid_alter_dailybalance_id'),
    ]

    operations = [
        migrations.DeleteModel(
            name='DailyBalance',
        ),
    ]