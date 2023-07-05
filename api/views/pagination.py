from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from collections import OrderedDict


class APIPaginator(PageNumberPagination):
    page_size = 25
    page_query_param = "page"
    page_size_query_param = "page_size"
    max_page_size = 1000

    def get_paginated_response(self, data):
        page = self.page
        paginator = self.page.paginator
        return Response(
            OrderedDict(
                [
                    ("page", page.number),
                    ("page_size", page.paginator.per_page),
                    ("total_count", paginator.count),
                    ("results", data),
                ]
            )
        )
