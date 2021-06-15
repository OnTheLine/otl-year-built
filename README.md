# otl-year-built
Leaflet map of parcels by year/decade/century built to display history of property development in West Hartford CT, for https://OnTheLine.trincoll.edu

## Source
Town of West Hartford and AppGeo, June 2021, from jared.morin@westhartfordct.gov and Rebecca Talamini (spatialiqsupport@appgeo.com)

Processed in https://Mapshaper.org by Jack Dougherty to clean parcels and create decadebuilt column

![screenshot](wh-screenshot.png)

## Notes
Note that "yearbuilt" means "most recent year built for this parcel" because this present-day database does not record when a building was first erected on a site (e.g. 1910), then torn down and rebuilt (e.g. 1970). Only the most recent date is stored in this database (e.g. 1970).

Also, "yearbuilt" data missing for about 600 out of 20,000 parcels (3%).

Note that "decadebuilt" is based on "yearbuilt" and only lists decades for 1900 onward. Prior years are coded into three periods: 1700, 1800, 1850.

GIS_Area is measured in acres (eg. 4 Frederick Road = 0.16 acres)

See individual parcel public database https://gis.vgsi.com/westhartfordct/

## Steps to create GeoJSON and CSV files
- Uploaded shapefiles.zip to Mapshaper.org
- ignore 23 line intersections
- console: -proj wgs84
- console: -split ParcelType, which divided into different files by type:
  - 20,042 Parcel
  - 2,387 Condo Main
  - 22 unnamed
  - 1 Water
  - 1 Private ROW
  - 1 Paper Street
- Export into separate geojson files
- Also, export Condo Main into CSV and create pivot table by ParcelID and yearbuilt. Note that 56 features have multiple entries (units on same lot) but same ParcelID and same GIS_Area (where each condo is listed as the entire property lot, so needed to eliminate duplicates)
- Upload only the Condo predissolved geojson file, where multiple condos have same ParcelID (but slightly different addresses), and use console to dissolve but "copy" (aka keep) first instance of selected fields into the dissolved feature.
  - console: $ dissolve ParcelID copy-fields=ParcelID,ParcelType,siteaddres,GIS_Area,yearbuilt
  - [dissolve] Dissolved 2,387 features into 56 features
- Manually assign decadebuilt field to Condo CSV, and join to Condo GeoJSON
- Upload only Parcels predissolved geojson, where a few hundred multiple units have same ParcelID (similar to condos), and dissolve but keep first instance as above.
  - $ dissolve ParcelID copy-fields=ParcelID,ParcelType,siteaddres,GIS_Area,yearbuilt
  - [dissolve] Dissolved 20,042 features into 19,865 features
- Upload only unnamed GeoJSON, export CSV, and join in decadebuilt field. About 20 rows are empty and must be ignored.
- -merge-layers target=WH-Parcel-decadebuilt,WH-Condo-decadebuilt,WH-unnamed-decadebuilt
- simplified 100MB fullsize GeoJSON down to 11MB (at 0.5% level, which you think would be even smaller, but it's not)
- -split decadebuilt (to produce one GeoJSON file for each decade/century)
- downloaded WH-yearbuilt.csv and created pivot table to show results

## Results

| Decade-Century Built | Count | Percent |
|----------------------|-------|---------|
| 1700                 | 25    | 0%      |
| 1800                 | 25    | 0%      |
| 1850                 | 162   | 1%      |
| 1900                 | 205   | 1%      |
| 1910                 | 784   | 4%      |
| 1920                 | 3019  | 15%     |
| 1930                 | 2183  | 11%     |
| 1940                 | 3020  | 15%     |
| 1950                 | 6199  | 31%     |
| 1960                 | 2181  | 11%     |
| 1970                 | 742   | 4%      |
| 1980                 | 306   | 2%      |
| 1990                 | 179   | 1%      |
| 2000                 | 206   | 1%      |
| 2010                 | 90    | 0%      |
| 2020                 | 7     | 0%      |
| na                   | 594   | 3%      |
| Total                | 19927 | 100%    |


| Decade-Century Built | Acres | Percent |
|----------------------|-------|---------|
| 1700                 | 24    | 0%      |
| 1800                 | 117   | 1%      |
| 1850                 | 78    | 1%      |
| 1900                 | 111   | 1%      |
| 1910                 | 248   | 2%      |
| 1920                 | 797   | 6%      |
| 1930                 | 810   | 6%      |
| 1940                 | 940   | 8%      |
| 1950                 | 2949  | 24%     |
| 1960                 | 3123  | 25%     |
| 1970                 | 560   | 4%      |
| 1980                 | 309   | 2%      |
| 1990                 | 172   | 1%      |
| 2000                 | 407   | 3%      |
| 2010                 | 145   | 1%      |
| 2020                 | 3     | 0%      |
| na                   | 1721  | 14%     |
| Total                | 12517 | 100%    |

Acres based on sum of GIS_Area

#TODO
create interactive map
