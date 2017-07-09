# Etuovi

Security scanner which probes the front door of your web applications.

Why Etuovi? Well I wanted to call this front-door but that npm package already exists. And given the limited
imagination I have, I just used Google Translate until I found a translation of front door that sounded cool. 
Hence, Etuovi. Which Google reliably informs me is the Finnish for front door (if it's not, please tell me).

## Getting Started

Etuovi is designed to run as a global package:

    $ npm install -g etuovi 

Now you probably want to make a directory to hold your scan configuration and output reports.

    $ mkdir etuovi-config && cd etuovi-config

Now create a starter configuration file which we'll need to edit later:

    $ etuovi new-config

You'll get a config file with a name like this `etuovi-config-20170708-233728.json` with contents like this:

```
{
    "hosts": [
        {
            "host": "www.example.com",
            "scanners": {
                "nmap": {
                    "expect": "443"
                },
                "port": {
                    "expect": "443"
                },
                "securityheaders": {
                    "expect": "A"
                },
                "ssllabs": {
                    "expect": "A"
                },
                "statuscodes": {
                    "paths": [
                        {
                            "path": "/",
                            "method": "GET",
                            "expect": 200
                        }
                    ]
                }
            }
        }
    ]
}
```

In essence, you configure multiple hosts with multple scanners per host. 

Note that the expect properties are not currently used. They will be the basis of alerting in the future.

## Configuring Scanners

### Nmap

This scanner is a convenience wrapper around nmap. Consequently, in order for this scanner to work, nmap must be on the path.

The `options` property can be omitted and a default nmap port scan will be performed.

```
...
"scanners": {
    "nmap": {
        "options": "-sn",
        "expect": "443" 
    }
}
```

### Port

This scanner uses the [Evilscan](https://github.com/eviltik/evilscan) module and is provided for situations where installing nmap is not possible.

The `ports` property can be omitted and a default the port scan will be performed for the top [1000 ports](http://www.nullsec.us/top-1-000-tcp-and-udp-ports-nmap-default/) as per nmap. 

```
...
"scanners": {
    "port": {
        "ports": "22,44-55,80,443",
        "expect": "443" 
    }
}
```

### securityheaders.io

This scanner will perform a scan for security headers using securityheaders.io. 

Note that this module is subject to change.

```
...
"scanners": {
    "securityheaders": {
        "expect": "A" 
    }
}
```

### SSL Labs

This scanner will check the SSL configuration using the Qualys SSL Labs API. Please go read the terms and conditions of the API usage.

```
...
"scanners": {
    "ssllabs": {
        "expect": "A" 
    }
}
```

### Status codes

This scanner will inspect an array of paths, reporting on the http status codes it encounters. You can use this to check that redirects are working etc.

```
...
"scanners": {
    "statuscodes": {
        "paths": [
            {
                "path": "/",
                "method": "GET",
                "expect": 200
            }
        ]
    }
}
```

## Reporting

Each time you invoke Etuovi, the full detailed reports of the scans are written to the `reports` directory of the current working directory. The file name will look something like `etuovi__www.facebook.com__nmap__20170707__221954.json`

## Logging

The log output of Etuovi can be controlled via the `--log-level` argument:

    $ etuovi scan my-config.json --log-level=verbose
    

