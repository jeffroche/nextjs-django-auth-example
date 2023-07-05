from django.db import models


class AuditHistory(models.Model):
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)


class CoffeeQuerySet(models.QuerySet):
    def annotate_is_favorite(self, user):
        return self.annotate(
            is_favorite=models.Case(
                models.When(users__id=user.id, then=True),
                default=False,
                output_field=models.BooleanField(),
            )
        )


class Coffee(models.Model):
    name = models.CharField(max_length=255, blank=False)
    brand = models.ForeignKey("Brand", related_name="coffees", on_delete=models.CASCADE)
    users = models.ManyToManyField("User", related_name="coffees")

    objects: CoffeeQuerySet = CoffeeQuerySet.as_manager()

    def __str__(self):
        return f"{self.name} - {self.brand}"


class BrandQuerySet(models.QuerySet):
    def annotate_is_favorite(self, user):
        return self.annotate(
            is_favorite=models.Case(
                models.When(users__id=user.pk, then=True),
                default=False,
                output_field=models.BooleanField(),
            )
        )


class Brand(models.Model):
    name = models.CharField(max_length=255, blank=False)
    users = models.ManyToManyField("User", related_name="brands")
    image = models.ImageField(upload_to="brands", blank=True, null=True)

    objects: BrandQuerySet = BrandQuerySet.as_manager()

    def __str__(self):
        return f"{self.name}"
