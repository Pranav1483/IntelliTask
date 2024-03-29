from django.shortcuts import render
from rest_framework.decorators import api_view
from django.http import HttpResponse, JsonResponse
from .models import User, Task
from .serializers import UserSerializer, TaskSerializer
import json
from datetime import datetime, timedelta
from dateutil import relativedelta
from django.conf import settings
from pytz import timezone


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def test(request):
    return HttpResponse(status=200)

@api_view(['POST'])
def getUser(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        try:
            user = User.objects.get(email=data['email'])
        except:
            user = User(firstName=data['firstName'], 
                        lastName=data['lastName'],
                        email=data['email'])
            user.save()
        userData = UserSerializer(user).data
        return JsonResponse(userData, status=200)
    except Exception as e:
        return HttpResponse(status=500)

@api_view(['GET'])
def getTasks(request, user_id):
    try:
        tasks = Task.objects.filter(user_id=user_id)
        res = []
        for task in list(tasks):
            res.append({"id": task.id, "task": task.title, "date": task.deadline, "completion": "Complete" if task.progress == 100 else "Incomplete", "priority": task.priority, "progress": task.progress, "repeat": task.repeat})
        return JsonResponse(res, status=200, safe=False)
    except Exception as e:
        return HttpResponse(status=500)
    
@api_view(['GET'])
def getTask(request, id):
    try:
        user_id, task_id = id.split('_')
        task = Task.objects.get(id=task_id, user_id=user_id)
        taskData = TaskSerializer(task).data
        return JsonResponse(taskData, status=200)
    except:
        return HttpResponse(status=500)

@api_view(['PUT'])
def updateTask(request, id):
    try:
        data = json.loads(request.body.decode('utf-8'))
        updated_subtasks, updated_progress = data['subtask'], data['progress']
        user_id, task_id = id.split('_')
        task = Task.objects.get(id=task_id, user_id=user_id)
        try:
            res = True
            for subtask in updated_subtasks:
                if list(subtask.values())[0] == 0:
                    res = False
                    break
            if res and task.repeat != "NONE":
                for i in range(len(updated_subtasks)):
                    for key in updated_subtasks[i].keys():
                        updated_subtasks[i][key] = 0
                updated_progress = 0
            task.subtasks = updated_subtasks
            task.progress = updated_progress
            if res:
                if task.repeat == "DAILY":
                    task.deadline += timedelta(days=1)
                elif task.repeat == "WEEKLY":
                    task.deadline += timedelta(days=7)
                elif task.repeat == "MONTHLY":
                    task.deadline += relativedelta(months=1)
                task.created = datetime.now(timezone(settings.TIME_ZONE))
            task.save()
            return HttpResponse(status=204)
        except Exception as e:
            return HttpResponse(status=403)
    except Exception as e:
        return HttpResponse(status=500)
    
@api_view(['DELETE'])
def deleteTask(request, id):
    try:
        user_id, task_id = id.split('_')
        try:
            task = Task.objects.get(id=task_id, user_id=user_id)
            task.delete()
            return HttpResponse(status=204)
        except:
            return HttpResponse(status=403)
    except:
        return HttpResponse(status=500)
    
@api_view(["POST"])
def newTask(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        deadline = datetime.strptime(data['deadline'], "%Y-%m-%dT%H:%M:%S.%f%z")
        deadline = deadline.astimezone(timezone(settings.TIME_ZONE))
        obj = Task(user=User.objects.get(id=data['id']),
                   title=data['title'],
                   deadline=deadline,
                   subtasks=data['subtasks'],
                   priority=data['priority'],
                   repeat=data['repeat'])
        obj.save()
        return HttpResponse(status=200)
    except Exception as e:
        return HttpResponse(status=500)