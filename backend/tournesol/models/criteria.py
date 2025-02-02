from django.conf import settings
from django.db import models

from .poll import Poll


class Criteria(models.Model):
    name = models.SlugField(unique=True)

    def __str__(self) -> str:
        return self.name


class CriteriaRank(models.Model):
    class Meta:
        ordering = ["poll", "-rank", "pk"]
        unique_together = ["criteria", "poll"]

    criteria = models.ForeignKey(Criteria, on_delete=models.CASCADE)
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE)
    rank = models.IntegerField(default=0)
    optional = models.BooleanField(default=True)


class CriteriaLocale(models.Model):
    class Meta:
        unique_together = ["criteria", "language"]

    criteria = models.ForeignKey(Criteria, on_delete=models.CASCADE, related_name="locales")
    language = models.CharField(max_length=10, choices=settings.LANGUAGES)
    label = models.CharField(max_length=255)
