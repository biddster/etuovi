# Etuovi

Security scanner which probes the front door of your web applications.

**Why Etuovi?** 

I needed to scan some webapps at work using the usual suspects (nmap, ssllabs, securityheaders) and I figured a cmd line thingy to tie all those together would be pretty quick to write. Hope it's useful to you too.

**Why is it called Etuovi?**

Well I wanted to call this front-door but that npm package already exists. And given the limited
imagination I have, I just used Google Translate until I found a translation of front door that sounded cool. 
Hence, Etuovi. Which Google reliably informs me is the Finnish for front door (if it's not, please tell me).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Getting Started](#getting-started)
- [Configuring Scanners](#configuring-scanners)
  - [Nmap](#nmap)
  - [Port](#port)
  - [securityheaders.io](#securityheadersio)
  - [SSL Labs](#ssl-labs)
  - [Status codes](#status-codes)
- [Configuring Outputs](#configuring-outputs)
  - [File output](#file-output)
  - [Slack output](#slack-output)
- [Actually Running a scan using Etuovi](#actually-running-a-scan-using-etuovi)
- [Logging](#logging)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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
    ],
    "outputs": {
        "file": {
            "reportsDir": "reports"
        },
        "slack": {
            "slackWebhook": ""
        }
    }
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

This scanner will perform a scan for security headers using securityheaders.io. It supports multiple paths under the host to handle the
scenario where you have multiple web apps under a host.

The `paths` property can be omitted and a default of "/" will be used.

```
...
"scanners": {
    "securityheaders": {
        "paths": [
            "/appA",
            "/appB"
        ]
        "expect": "A" 
    }
}
```

### SSL Labs

This scanner will check the SSL configuration using the Qualys SSL Labs API. Please go read the terms and conditions of the API usage.

By default, the scan will use a `maxAge` of 23 hours and allow the results to come `fromCache`. Tweak the values below to your liking, or
omit them if they suit. See here for more details. https://github.com/ssllabs/ssllabs-scan/blob/stable/ssllabs-api-docs.md

```
...
"scanners": {
    "ssllabs": {
        "fromCache": true,
        "maxAge": 23
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

## Configuring Outputs

By default, Etuovi writes to the console. However, there are other outputs available when scanning.

### File output

```
 "outputs": {
        "file": {
            "reportsDir": "reports"
        }
    }
```

If you enable the `file` output, the full detailed reports of the scans are written, by default, to the `reports` directory of the current working directory. The file name will look something like `etuovi__scan__report__20170707__221954.json`. To change the output directory, change the `reportsDir` property in the `file` output configuration.


### Slack output

Etuovi can post a message to slack containing the summaries of all the scans of all the hosts in your config file.

```
 "outputs": {
        "slack": {
            "slackWebhook": "https://hooks.slack.com/services/XXX/XXX"
        }
    }
```


## Actually Running a scan using Etuovi

    $ etuovi scan etuovi-config-20170708-233728.json


## Logging

The log output of Etuovi can be controlled via the `--log-level` argument:

    $ etuovi scan my-config.json --log-level=verbose
    

