# Generated by Django 3.2 on 2021-05-15 21:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0008_profile_zoom_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='meeting',
            name='m_uuid',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
