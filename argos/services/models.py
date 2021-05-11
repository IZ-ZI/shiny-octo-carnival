# django imports
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    phone = models.CharField(max_length=20)
    # renew key
    renew = models.TextField(null=True)
    # token key
    token = models.TextField(null=True)
    # token last refreshed
    llt = models.DateField(null=True)
    # zoom id
    zoom_id = models.CharField(max_length=50, null=True)
    # stores path to icon
    icon = models.CharField(max_length=256)

class Meeting(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    m_id = models.AutoField(primary_key=True)
    m_topic = models.TextField(null=True)
    m_type = models.BigIntegerField(null=True)
    m_date = models.CharField(max_length=28, null=True)
    m_creation = models.DateField(null=True)
    m_length = models.CharField(max_length=5, null=True)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        Meeting.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

@receiver(post_delete, sender=User)
def delete_related_meeting(sender, instance, **kwargs):
    instance.meeting.delete()