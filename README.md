# otl-year-built
Leaflet map of parcels by year built for West Hartford CT

## Source
Town of West Hartford and AppGeo, June 2021, from jared.morin@westhartfordct.gov and Rebecca Talamini (spatialiqsupport@appgeo.com)

![screenshot](wh-screenshot.png)

## Goal
I am requesting a GIS shapefile of West Hartford property parcels with these data fields:

- parcel ID
- location (street address)
- year built

With this data, we will build an open-access interactive map that displays the history of residential property development in West Hartford, with credit to the Town as the data source, and we will freely share our map with the others on the On The Line site.

## DecadeBuilt
Manually created a new column in CSV called "DecadeBuilt" to cluster by century/decade:

| Row Labels  | Count of decadebuilt |
|-------------|----------------------|
| 1700        | 25                   |
| 1800        | 26                   |
| 1850        | 162                  |
| 1900        | 255                  |
| 1910        | 809                  |
| 1920        | 3103                 |
| 1930        | 2207                 |
| 1940        | 3212                 |
| 1950        | 6230                 |
| 1960        | 2599                 |
| 1970        | 1214                 |
| 1980        | 626                  |
| 1990        | 301                  |
| 2000        | 671                  |
| 2010        | 97                   |
| 2020        | 7                    |
| na          | 910                  |
| (blank)     |                      |
| Grand Total | 22454                |

Note that 910 rows have "0" entry for yearbuilt, so decadebuilt is "na".

Also note that some rows are parcels, while others are condos.
