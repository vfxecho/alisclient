function geoplugin_request() { return '78.190.144.114';} 
function geoplugin_status() { return '200';} 
function geoplugin_credit() { return 'Some of the returned data includes GeoLite data created by MaxMind, available from <a href=\'http://www.maxmind.com\'>http://www.maxmind.com</a>.';} 
function geoplugin_delay() { return '1ms';} 
function geoplugin_city() { return 'Istanbul';} 
function geoplugin_region() { return 'Istanbul';} 
function geoplugin_regionCode() { return '34';} 
function geoplugin_regionName() { return 'Istanbul';} 
function geoplugin_areaCode() { return '';} 
function geoplugin_dmaCode() { return '';} 
function geoplugin_countryCode() { return 'TR';} 
function geoplugin_countryName() { return 'Turkey';} 
function geoplugin_inEU() { return 0;} 
function geoplugin_euVATrate() { return ;} 
function geoplugin_continentCode() { return 'AS';} 
function geoplugin_latitude() { return '41.0247';} 
function geoplugin_longitude() { return '28.9252';} 
function geoplugin_locationAccuracyRadius() { return '5';} 
function geoplugin_timezone() { return 'Europe/Istanbul';} 
function geoplugin_currencyCode() { return 'TRY';} 
function geoplugin_currencySymbol() { return '&#89;&#84;&#76;';} 
function geoplugin_currencySymbol_UTF8() { return 'YTL';} 
function geoplugin_currencyConverter(amt, symbol) { 
	if (!amt) { return false; } 
	var converted = amt * 19.2583; 
	if (converted <0) { return false; } 
	if (symbol === false) { return Math.round(converted * 100)/100; } 
	else { return '&#89;&#84;&#76;'+(Math.round(converted * 100)/100);} 
	return false; 
} 
