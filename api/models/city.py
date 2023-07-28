from django.db import models


class State(models.Model):
    class StateAbbreviation(models.IntegerChoices):
        AL = 1, "Alabama"
        AK = 2, "Alaska"
        AZ = 3, "Arizona"
        AR = 4, "Arkansas"
        CA = 5, "California"
        CZ = 6, "Canal"
        CO = 7, "Colorado"
        CT = 8, "Connecticut"
        DE = 9, "Delaware"
        DC = 10, "District"
        FL = 11, "Florida"
        GA = 12, "Georgia"
        GU = 13, "Guam"
        HI = 14, "Hawaii"
        ID = 15, "Idaho"
        IL = 16, "Illinois"
        IN = 17, "Indiana"
        IA = 18, "Iowa"
        KS = 19, "Kansas"
        KY = 20, "Kentucky"
        LA = 21, "Louisiana"
        ME = 22, "Maine"
        MD = 23, "Maryland"
        MA = 24, "Massachusetts"
        MI = 25, "Michigan"
        MN = 26, "Minnesota"
        MS = 27, "Mississippi"
        MO = 28, "Missouri"
        MT = 29, "Montana"
        NE = 30, "Nebraska"
        NV = 31, "Nevada"
        NH = 32, "New Hampshire"
        NJ = 33, "New Jersey"
        NM = 34, "New Mexico"
        NY = 35, "New York"
        NC = 36, "North Carolina"
        ND = 37, "North Dakota"
        OH = 38, "Ohio"
        OK = 39, "Oklahoma"
        OR = 40, "Oregon"
        PA = 41, "Pennsylvania"
        PR = 42, "Puerto Rico"
        RI = 43, "Rhode Island"
        SC = 44, "South Carolina"
        SD = 45, "South Dakota"
        TN = 46, "Tennessee"
        TX = 47, "Texas"
        UT = 48, "Utah"
        VT = 49, "Vermont"
        VI = 50, "Virgin Islands"
        VA = 51, "Virginia"
        WA = 52, "Washington"
        WV = 53, "West Virginia"
        WI = 54, "Wisconsin"
        WY = 55, "Wyoming"

    name = models.IntegerField(choices=StateAbbreviation.choices)

    @property
    def state_name(self):
        return self.StateAbbreviation(self.name).label

    @property
    def state_abbr(self):
        return self.StateAbbreviation(self.name)._name_

    def __str__(self):
        return f"{self.state_name} - {self.state_abbr}"


class City(models.Model):
    name = models.CharField(max_length=255, unique=True)
    zip_code = models.IntegerField(max_length=5, unique=True)
    state = models.ForeignKey("State", related_name="cities", on_delete=models.CASCADE)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.name}, {State.StateAbbreviation(self.state.name)._name_}"
