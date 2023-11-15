from django.db import models
import datetime
import pytz

class User(models.Model):
    email = models.EmailField(null=False, unique=True)
    firstName = models.CharField(max_length=16, null=False)
    lastName = models.CharField(max_length=16, null=True)

class Task(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE, null=False)
    title = models.CharField(max_length=256, null=False)
    created = models.DateTimeField(default=datetime.datetime.now(pytz.timezone('Asia/Kolkata')))
    deadline = models.DateTimeField(default=datetime.datetime.now(pytz.timezone('Asia/Kolkata')))
    progress = models.IntegerField(default=0)
    subtasks = models.JSONField(null=False)
    priority = models.BooleanField(default=False)
