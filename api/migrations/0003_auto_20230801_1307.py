# Generated by Django 3.2 on 2023-08-01 13:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_user_clerk_id'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='group',
            options={},
        ),
        migrations.AlterModelOptions(
            name='pacinggroup',
            options={},
        ),
        migrations.AlterModelOptions(
            name='traininggroup',
            options={},
        ),
        migrations.RemoveField(
            model_name='group',
            name='polymorphic_ctype',
        ),
    ]