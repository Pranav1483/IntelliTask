from rest_framework import serializers
from .models import User, Task

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id',
                  'email',
                  'firstName',
                  'lastName')
        
class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = ('id',
                  'user',
                  'title',
                  'created',
                  'deadline',
                  'progress',
                  'subtasks',
                  'priority')