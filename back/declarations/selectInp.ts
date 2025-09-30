
/* eslint-disable */

  
    export type userInp = {
      avatar?: number | fileInp
national_card?: number | fileInp
      uploadedAssets?: number | fileInp
registered_places?: number | placeInp
comments?: number | commentInp
    }


    export type userSchema = {
_id?: string;
first_name: string;
last_name: string;
father_name?: string;
gender: ("Male" | "Female" );
birth_date?: Date;
summary?: string;
address?: string;
level: ("Ghost" | "Manager" | "Editor" | "Ordinary" );
email: string;
is_verified: boolean;
createdAt: Date;
updatedAt: Date;
avatar?: {
_id?: string;
name: string;
mimType: string;
size: number;
alt_text?: string;
createdAt: Date;
updatedAt: Date;
};
national_card?: {
_id?: string;
name: string;
mimType: string;
size: number;
alt_text?: string;
createdAt: Date;
updatedAt: Date;
};
uploadedAssets: {
_id?: string;
name: string;
mimType: string;
size: number;
alt_text?: string;
createdAt: Date;
updatedAt: Date;
}[];
registered_places: {
_id?: string;
name: string;
description: string;
slug?: string;
center: {
type: "Point";
coordinates: any[];
};
area: {
type: "MultiPolygon";
coordinates: any[];
};
address?: string;
contact?: {
phone?: string;
email?: string;
website?: string;
social?: string[];
};
hoursOfOperation?: string;
meta?: Record<string, any>;
status: ("draft" | "active" | "archived" );
createdAt: Date;
updatedAt: Date;
}[];
comments: {
_id?: string;
text: string;
rating?: number;
status: ("pending" | "approved" | "rejected" );
is_anonymous: boolean;
createdAt: Date;
updatedAt: Date;
}[];
};
;


    export type fileInp = {
      uploader?: number | userInp
      
    }


    export type fileSchema = {
_id?: string;
name: string;
mimType: string;
size: number;
alt_text?: string;
createdAt: Date;
updatedAt: Date;
uploader: {
_id?: string;
first_name: string;
last_name: string;
father_name?: string;
gender: ("Male" | "Female" );
birth_date?: Date;
summary?: string;
address?: string;
level: ("Ghost" | "Manager" | "Editor" | "Ordinary" );
email: string;
is_verified: boolean;
createdAt: Date;
updatedAt: Date;
};
};
;


    export type provinceInp = {
      registrar?: number | userInp
      cities?: number | cityInp
center?: number | cityInp
places?: number | placeInp
    }


    export type provinceSchema = {
_id?: string;
name: string;
english_name: string;
area: {
type: "MultiPolygon";
coordinates: any[];
};
center: {
_id?: string;
name: string;
english_name: string;
area: {
type: "MultiPolygon";
coordinates: any[];
};
center: {
type: "Point";
coordinates: any[];
};
createdAt: Date;
updatedAt: Date;
}[];
createdAt: Date;
updatedAt: Date;
registrar?: {
_id?: string;
first_name: string;
last_name: string;
father_name?: string;
gender: ("Male" | "Female" );
birth_date?: Date;
summary?: string;
address?: string;
level: ("Ghost" | "Manager" | "Editor" | "Ordinary" );
email: string;
is_verified: boolean;
createdAt: Date;
updatedAt: Date;
};
cities: {
_id?: string;
name: string;
english_name: string;
area: {
type: "MultiPolygon";
coordinates: any[];
};
center: {
type: "Point";
coordinates: any[];
};
createdAt: Date;
updatedAt: Date;
}[];
places: {
_id?: string;
name: string;
description: string;
slug?: string;
center: {
type: "Point";
coordinates: any[];
};
area: {
type: "MultiPolygon";
coordinates: any[];
};
address?: string;
contact?: {
phone?: string;
email?: string;
website?: string;
social?: string[];
};
hoursOfOperation?: string;
meta?: Record<string, any>;
status: ("draft" | "active" | "archived" );
createdAt: Date;
updatedAt: Date;
}[];
};
;


    export type cityInp = {
      registrar?: number | userInp
province?: number | provinceInp
      city_zones?: number | city_zoneInp
places?: number | placeInp
    }


    export type citySchema = {
_id?: string;
name: string;
english_name: string;
area: {
type: "MultiPolygon";
coordinates: any[];
};
center: {
type: "Point";
coordinates: any[];
};
createdAt: Date;
updatedAt: Date;
registrar?: {
_id?: string;
first_name: string;
last_name: string;
father_name?: string;
gender: ("Male" | "Female" );
birth_date?: Date;
summary?: string;
address?: string;
level: ("Ghost" | "Manager" | "Editor" | "Ordinary" );
email: string;
is_verified: boolean;
createdAt: Date;
updatedAt: Date;
};
province?: {
_id?: string;
name: string;
english_name: string;
area: {
type: "MultiPolygon";
coordinates: any[];
};
center: {
type: "Point";
coordinates: any[];
};
createdAt: Date;
updatedAt: Date;
};
city_zones: {
_id?: string;
name: string;
center: {
type: "Point";
coordinates: any[];
};
area: {
type: "MultiPolygon";
coordinates: any[];
};
createdAt: Date;
updatedAt: Date;
}[];
places: {
_id?: string;
name: string;
description: string;
slug?: string;
center: {
type: "Point";
coordinates: any[];
};
area: {
type: "MultiPolygon";
coordinates: any[];
};
address?: string;
contact?: {
phone?: string;
email?: string;
website?: string;
social?: string[];
};
hoursOfOperation?: string;
meta?: Record<string, any>;
status: ("draft" | "active" | "archived" );
createdAt: Date;
updatedAt: Date;
}[];
};
;


    export type city_zoneInp = {
      registrar?: number | userInp
city?: number | cityInp
      places?: number | placeInp
    }


    export type city_zoneSchema = {
_id?: string;
name: string;
center: {
type: "Point";
coordinates: any[];
};
area: {
type: "MultiPolygon";
coordinates: any[];
};
createdAt: Date;
updatedAt: Date;
registrar?: {
_id?: string;
first_name: string;
last_name: string;
father_name?: string;
gender: ("Male" | "Female" );
birth_date?: Date;
summary?: string;
address?: string;
level: ("Ghost" | "Manager" | "Editor" | "Ordinary" );
email: string;
is_verified: boolean;
createdAt: Date;
updatedAt: Date;
};
city?: {
_id?: string;
name: string;
english_name: string;
area: {
type: "MultiPolygon";
coordinates: any[];
};
center: {
type: "Point";
coordinates: any[];
};
createdAt: Date;
updatedAt: Date;
};
places: {
_id?: string;
name: string;
description: string;
slug?: string;
center: {
type: "Point";
coordinates: any[];
};
area: {
type: "MultiPolygon";
coordinates: any[];
};
address?: string;
contact?: {
phone?: string;
email?: string;
website?: string;
social?: string[];
};
hoursOfOperation?: string;
meta?: Record<string, any>;
status: ("draft" | "active" | "archived" );
createdAt: Date;
updatedAt: Date;
}[];
};
;


    export type categoryInp = {
      registrar?: number | userInp
      
    }


    export type categorySchema = {
_id?: string;
name: string;
description: string;
color?: string;
icon?: string;
createdAt: Date;
updatedAt: Date;
registrar?: {
_id?: string;
first_name: string;
last_name: string;
father_name?: string;
gender: ("Male" | "Female" );
birth_date?: Date;
summary?: string;
address?: string;
level: ("Ghost" | "Manager" | "Editor" | "Ordinary" );
email: string;
is_verified: boolean;
createdAt: Date;
updatedAt: Date;
};
};
;


    export type tagInp = {
      registrar?: number | userInp
      
    }


    export type tagSchema = {
_id?: string;
name: string;
description: string;
color?: string;
icon?: string;
createdAt: Date;
updatedAt: Date;
registrar?: {
_id?: string;
first_name: string;
last_name: string;
father_name?: string;
gender: ("Male" | "Female" );
birth_date?: Date;
summary?: string;
address?: string;
level: ("Ghost" | "Manager" | "Editor" | "Ordinary" );
email: string;
is_verified: boolean;
createdAt: Date;
updatedAt: Date;
};
};
;


    export type placeInp = {
      registrar?: number | userInp
province?: number | provinceInp
city?: number | cityInp
city_zone?: number | city_zoneInp
category?: number | categoryInp
tags?: number | tagInp
thumbnail?: number | fileInp
gallery?: number | fileInp
      comments?: number | commentInp
    }


    export type placeSchema = {
_id?: string;
name: string;
description: string;
slug?: string;
center: {
type: "Point";
coordinates: any[];
};
area: {
type: "MultiPolygon";
coordinates: any[];
};
address?: string;
contact?: {
phone?: string;
email?: string;
website?: string;
social?: string[];
};
hoursOfOperation?: string;
meta?: Record<string, any>;
status: ("draft" | "active" | "archived" );
createdAt: Date;
updatedAt: Date;
registrar?: {
_id?: string;
first_name: string;
last_name: string;
father_name?: string;
gender: ("Male" | "Female" );
birth_date?: Date;
summary?: string;
address?: string;
level: ("Ghost" | "Manager" | "Editor" | "Ordinary" );
email: string;
is_verified: boolean;
createdAt: Date;
updatedAt: Date;
};
province?: {
_id?: string;
name: string;
english_name: string;
area: {
type: "MultiPolygon";
coordinates: any[];
};
center: {
type: "Point";
coordinates: any[];
};
createdAt: Date;
updatedAt: Date;
};
city?: {
_id?: string;
name: string;
english_name: string;
area: {
type: "MultiPolygon";
coordinates: any[];
};
center: {
type: "Point";
coordinates: any[];
};
createdAt: Date;
updatedAt: Date;
};
city_zone?: {
_id?: string;
name: string;
center: {
type: "Point";
coordinates: any[];
};
area: {
type: "MultiPolygon";
coordinates: any[];
};
createdAt: Date;
updatedAt: Date;
};
category?: {
_id?: string;
name: string;
description: string;
color?: string;
icon?: string;
createdAt: Date;
updatedAt: Date;
}[];
tags?: {
_id?: string;
name: string;
description: string;
color?: string;
icon?: string;
createdAt: Date;
updatedAt: Date;
}[];
thumbnail?: {
_id?: string;
name: string;
mimType: string;
size: number;
alt_text?: string;
createdAt: Date;
updatedAt: Date;
};
gallery?: {
_id?: string;
name: string;
mimType: string;
size: number;
alt_text?: string;
createdAt: Date;
updatedAt: Date;
}[];
comments: {
_id?: string;
text: string;
rating?: number;
status: ("pending" | "approved" | "rejected" );
is_anonymous: boolean;
createdAt: Date;
updatedAt: Date;
}[];
};
;


    export type commentInp = {
      user?: number | userInp
place?: number | placeInp
      
    }


    export type commentSchema = {
_id?: string;
text: string;
rating?: number;
status: ("pending" | "approved" | "rejected" );
is_anonymous: boolean;
createdAt: Date;
updatedAt: Date;
user: {
_id?: string;
first_name: string;
last_name: string;
father_name?: string;
gender: ("Male" | "Female" );
birth_date?: Date;
summary?: string;
address?: string;
level: ("Ghost" | "Manager" | "Editor" | "Ordinary" );
email: string;
is_verified: boolean;
createdAt: Date;
updatedAt: Date;
};
place: {
_id?: string;
name: string;
description: string;
slug?: string;
center: {
type: "Point";
coordinates: any[];
};
area: {
type: "MultiPolygon";
coordinates: any[];
};
address?: string;
contact?: {
phone?: string;
email?: string;
website?: string;
social?: string[];
};
hoursOfOperation?: string;
meta?: Record<string, any>;
status: ("draft" | "active" | "archived" );
createdAt: Date;
updatedAt: Date;
};
};
;


    export type ReqType = {

  
        main: {

      
        city: {

      
            add: {
set: {
name: string;
english_name: string;
area: {
type: "MultiPolygon";
coordinates: any[];
};
center: {
type: "Point";
coordinates: any[];
};
createdAt: Date;
updatedAt: Date;
provinceId: string;
isCenter: boolean;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zones?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            update: {
set: {
_id: string;
name?: string;
english_name?: string;
area?: {
type: "Polygon";
coordinates: any[];
};
center_location?: {
type: "Point";
coordinates: any[];
};
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zones?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            get: {
set: {
_id: string;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
cities?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
city_zones?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zone?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
category?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
tags?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
thumbnail?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
gallery?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
};

          
            gets: {
set: {
page: number;
limit: number;
name?: string;
provinceId?: string;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
cities?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
city_zones?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zone?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
category?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
tags?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
thumbnail?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
gallery?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
};

          
            remove: {
set: {
_id: string;
hardCascade?: boolean;
};
get: {
success?: (0 | 1 );
};
};

          
            count: {
set: {
name?: string;
};
get: {
qty?: (0 | 1 );
};
};

          
          }

        
        city_zone: {

      
            add: {
set: {
name: string;
center: {
type: "Point";
coordinates: any[];
};
area: {
type: "MultiPolygon";
coordinates: any[];
};
createdAt: Date;
updatedAt: Date;
cityId: string;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            update: {
set: {
_id: string;
name?: string;
area?: {
type: "MultiPolygon";
coordinates: any[];
};
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            get: {
set: {
_id: string;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zones?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zone?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
category?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
tags?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
thumbnail?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
gallery?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
};

          
            gets: {
set: {
page: number;
limit: number;
name?: string;
provinceId?: string;
cityId?: string;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zones?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zone?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
category?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
tags?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
thumbnail?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
gallery?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
};

          
            remove: {
set: {
_id: string;
hardCascade?: boolean;
};
get: {
success?: (0 | 1 );
};
};

          
            count: {
set: {
name?: string;
};
get: {
qty?: (0 | 1 );
};
};

          
          }

        
        file: {

      
            getFiles: {
set: {
page: number;
limit: number;
name?: string;
type?: ("image" | "video" | "doc" );
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
uploader?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
};

          
            uploadFile: {
set: {
type: ("video" | "image" | "doc" );
createdAt: Date;
updatedAt: Date;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
uploader?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
          }

        
        province: {

      
            add: {
set: {
name: string;
english_name: string;
area: {
type: "MultiPolygon";
coordinates: any[];
};
center: {
type: "Point";
coordinates: any[];
};
createdAt: Date;
updatedAt: Date;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
cities?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            update: {
set: {
_id: string;
name?: string;
english_name?: string;
area?: {
type: "Polygon";
coordinates: any[];
};
center_location?: {
type: "Point";
coordinates: any[];
};
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
cities?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            get: {
set: {
_id: string;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zones?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
cities?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zones?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zone?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
category?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
tags?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
thumbnail?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
gallery?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
};

          
            gets: {
set: {
page: number;
limit: number;
name?: string;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zones?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
cities?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zones?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zone?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
category?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
tags?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
thumbnail?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
gallery?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
};

          
            remove: {
set: {
_id: string;
hardCascade?: boolean;
};
get: {
success?: (0 | 1 );
};
};

          
            count: {
set: {
name?: string;
};
get: {
qty?: (0 | 1 );
};
};

          
          }

        
        user: {

      
            addUser: {
set: {
first_name: string;
last_name: string;
father_name: string;
mobile: string;
gender: ("Male" | "Female" );
birth_date?: Date;
summary?: string;
national_number: string;
address: string;
level: ("Ghost" | "Manager" | "Editor" | "Ordinary" );
is_verified: boolean;
nationalCard?: string;
avatar?: string;
};
get: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            getMe: {
set: {
};
get: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
uploader?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
uploader?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
uploader?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zone?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
category?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
tags?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
thumbnail?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
gallery?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
user?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
place?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
};

          
            getUser: {
set: {
_id: string;
};
get: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
uploader?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
uploader?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
uploader?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zone?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
category?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
tags?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
thumbnail?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
gallery?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
user?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
place?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
};

          
            login: {
set: {
email: string;
password: string;
};
get?: {
token?: (0 | 1 );
user: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
};

          
            tempUser: {
set: {
first_name: string;
last_name: string;
father_name: string;
mobile: string;
national_number: string;
};
get: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            updateUser: {
set: {
_id: string;
first_name?: string;
last_name?: string;
father_name?: string;
gender?: ("Male" | "Female" );
birth_date?: Date;
summary?: string;
address?: string;
};
get: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            registerUser: {
set: {
first_name: string;
last_name: string;
father_name?: string;
gender: ("Male" | "Female" );
birth_date?: Date;
summary?: string;
address?: string;
level: ("Ghost" | "Manager" | "Editor" | "Ordinary" );
email: string;
password: string;
is_verified: boolean;
createdAt: Date;
updatedAt: Date;
};
get: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            getUsers: {
set: {
levels?: ("Ghost" | "Manager" | "Editor" | "Ordinary" );
page: number;
limit: number;
};
get: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
uploader?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
uploader?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
uploader?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zone?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
category?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
tags?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
thumbnail?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
gallery?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
user?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
place?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
};

          
            removeUser: {
set: {
_id: string;
hardCascade?: boolean;
};
get: {
success?: (0 | 1 );
};
};

          
            countUsers: {
set: {
levels?: ("Ghost" | "Manager" | "Editor" | "Ordinary" );
};
get: {
qty: (0 | 1 );
};
};

          
            toggleFavArticle: {
set: {
articleId: string;
};
get: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            updateUserRelations: {
set: {
_id: string;
avatar?: string;
nationalCard?: string;
};
get: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            dashboardStatistic: {
set: {
};
get: {
users?: (0 | 1 );
provinces?: (0 | 1 );
cities?: (0 | 1 );
city_zones?: (0 | 1 );
locaions?: (0 | 1 );
categories?: (0 | 1 );
tags?: (0 | 1 );
};
};

          
          }

        
        place: {

      
            add: {
set: {
_id?: string;
name: string;
description: string;
slug?: string;
center: {
type: "Point";
coordinates: any[];
};
area: {
type: "MultiPolygon";
coordinates: any[];
};
address?: string;
contact?: {
phone?: string;
email?: string;
website?: string;
social?: string[];
};
hoursOfOperation?: string;
meta?: Record<string, any>;
status: ("draft" | "active" | "archived" );
createdAt: Date;
updatedAt: Date;
province: string;
city: string;
city_zone: string;
category: string;
tags?: string[];
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zone?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
category?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
tags?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
thumbnail?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
gallery?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            update: {
set: {
_id: string;
name?: string;
description?: string;
address?: string;
contact?: {
phone?: string;
website?: string;
};
hoursOfOperation?: string;
meta?: Record<string, any>;
center?: {
type: "Point";
coordinates: any[];
};
area?: {
type: "MultiPolygon";
coordinates: any[];
};
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zone?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
category?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
tags?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
thumbnail?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
gallery?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            get: {
set: {
_id: string;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
cities?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zones?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
city_zone?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
category?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
tags?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
thumbnail?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
uploader?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
gallery?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
uploader?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
user?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
place?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
};

          
            gets: {
set: {
page: number;
limit: number;
name?: string;
slug?: string;
status?: ("draft" | "active" | "archived" );
province?: string;
city?: string;
cityZone?: string;
registrarId?: string;
categoryIds?: string[];
tagIds?: string[];
polygon?: {
type: "Polygon";
coordinates: any[];
};
area?: {
type: "Polygon";
coordinates: any[];
};
near?: {
type: "Point";
coordinates: any[];
};
maxDistance?: number;
minDistance?: number;
};
get: {
data: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
cities?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zones?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
city_zone?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
category?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
tags?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
thumbnail?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
uploader?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
gallery?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
uploader?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
user?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
place?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
metadata: {
total?: (0 | 1 );
page?: (0 | 1 );
limit?: (0 | 1 );
pageCount?: (0 | 1 );
};
};
};

          
            remove: {
set: {
_id: string;
hardCascade?: boolean;
};
get: {
success?: (0 | 1 );
};
};

          
            count: {
set: {
name?: string;
province?: string;
city?: string;
cityZone?: string;
polygon?: {
type: "Polygon";
coordinates: any[];
};
};
get: {
total?: (0 | 1 );
filtered?: (0 | 1 );
};
};

          
          }

        
        comment: {

      
            add: {
set: {
text: string;
rating?: number;
status: ("pending" | "approved" | "rejected" );
is_anonymous: boolean;
createdAt: Date;
updatedAt: Date;
place: string;
};
get: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
user?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
place?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            update: {
set: {
_id: string;
text?: string;
rating?: number;
status?: ("pending" | "approved" | "rejected" );
is_anonymous?: boolean;
};
get: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
user?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
place?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            get: {
set: {
_id: string;
};
get: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
user?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
place?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zone?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
category?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
tags?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
thumbnail?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
gallery?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
};

          
            gets: {
set: {
page: number;
limit: number;
text?: string;
status?: string;
rating?: number;
is_anonymous?: boolean;
place?: string;
user?: string;
};
get: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
user?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
place?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
province?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city?: {
_id?: (0 | 1 );
name?: (0 | 1 );
english_name?: (0 | 1 );
area?: (0 | 1 );
center?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
city_zone?: {
_id?: (0 | 1 );
name?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
category?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
tags?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
thumbnail?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
gallery?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
};

          
            remove: {
set: {
_id: string;
hardCascade?: boolean;
};
get: {
success?: (0 | 1 );
};
};

          
            count: {
set: {
text?: string;
status?: string;
rating?: number;
is_anonymous?: boolean;
place?: string;
user?: string;
};
get: {
total?: (0 | 1 );
filtered?: (0 | 1 );
};
};

          
          }

        
        tag: {

      
            add: {
set: {
name: string;
description: string;
color?: string;
icon?: string;
createdAt: Date;
updatedAt: Date;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            update: {
set: {
_id: string;
name?: string;
description?: string;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            get: {
set: {
_id: string;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
};

          
            gets: {
set: {
page: number;
limit: number;
name?: string;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
};

          
            remove: {
set: {
_id: string;
hardCascade?: boolean;
};
get: {
success?: (0 | 1 );
};
};

          
            count: {
set: {
name?: string;
};
get: {
qty?: (0 | 1 );
};
};

          
          }

        
        category: {

      
            add: {
set: {
name: string;
description: string;
color?: string;
icon?: string;
createdAt: Date;
updatedAt: Date;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            update: {
set: {
_id: string;
name?: string;
description?: string;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};

          
            get: {
set: {
_id: string;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
};

          
            gets: {
set: {
page: number;
limit: number;
name?: string;
};
get: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
color?: (0 | 1 );
icon?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
registrar?: {
_id?: (0 | 1 );
first_name?: (0 | 1 );
last_name?: (0 | 1 );
father_name?: (0 | 1 );
gender?: (0 | 1 );
birth_date?: (0 | 1 );
summary?: (0 | 1 );
address?: (0 | 1 );
level?: (0 | 1 );
email?: (0 | 1 );
is_verified?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
avatar?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
national_card?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
uploadedAssets?: {
_id?: (0 | 1 );
name?: (0 | 1 );
mimType?: (0 | 1 );
size?: (0 | 1 );
alt_text?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
registered_places?: {
_id?: (0 | 1 );
name?: (0 | 1 );
description?: (0 | 1 );
slug?: (0 | 1 );
center?: (0 | 1 );
area?: (0 | 1 );
address?: (0 | 1 );
contact?: (0 | 1 );
hoursOfOperation?: (0 | 1 );
meta?: (0 | 1 );
status?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
comments?: {
_id?: (0 | 1 );
text?: (0 | 1 );
rating?: (0 | 1 );
status?: (0 | 1 );
is_anonymous?: (0 | 1 );
createdAt?: (0 | 1 );
updatedAt?: (0 | 1 );
};
};
};
};

          
            remove: {
set: {
_id: string;
hardCascade?: boolean;
};
get: {
success?: (0 | 1 );
};
};

          
            count: {
set: {
name?: string;
};
get: {
qty?: (0 | 1 );
};
};

          
          }

        
        }

      
    };

  
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export const lesanApi = (
	{ URL, settings, baseHeaders }: {
		URL: string;
		settings?: Record<string, any>;
		baseHeaders?: Record<string, any>;
	},
) => {
	const setting = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...baseHeaders,
		},
		...settings,
	};

	const setHeaders = (headers: Record<string, any>) => {
		setting.headers = {
			...setting.headers,
			...headers,
		};
	};

	const getSetting = () => setting;

	const send = async <
		TService extends keyof ReqType,
		TModel extends keyof ReqType[TService],
		TAct extends keyof ReqType[TService][TModel],
    // @ts-ignore: Unreachable code error
		TSet extends DeepPartial<ReqType[TService][TModel][TAct]["set"]>,
    // @ts-ignore: Unreachable code error
		TGet extends DeepPartial<ReqType[TService][TModel][TAct]["get"]>,
	>(body: {
		service?: TService;
		model: TModel;
		act: TAct;
		details: {
			set: TSet;
			get: TGet;
		};
	}, additionalHeaders?: Record<string, any>) => {
		const req = await fetch(URL, {
			...getSetting(),
			headers: {
				...getSetting().headers,
				...additionalHeaders,
		    connection: "keep-alive",
			},
			body: JSON.stringify(body),
		});

		return await req.json();
	};

	return { send, setHeaders };
};

  