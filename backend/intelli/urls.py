from django.urls import path
from . import views

urlpatterns = [
    path("", views.test, name='test'),
    path("user", views.getUser, name='getUser'),
    path("usertasks/<user_id>", views.getTasks, name='getTasks'),
    path("task/<id>", views.getTask, name='getTask'),
    path("task/update/<id>", views.updateTask, name="updateTask"),
    path("task/delete/<id>", views.deleteTask, name="deleteTask"),
    path("newtask", views.newTask, name='addTask')
]