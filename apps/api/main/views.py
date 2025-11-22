from django.http import JsonResponse


def test_api(request):
    return JsonResponse({
        "status": "success",
        "message": "Test API is working!"
    })
