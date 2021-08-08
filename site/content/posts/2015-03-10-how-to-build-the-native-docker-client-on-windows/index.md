{
	"slug": "how-to-build-the-native-docker-client-on-windows",
	"title": "How To Build The Native Docker Client On Windows",
	"description": null,
	"date": "2015-03-10 16:52:55 +1100"
}

Requisites
========

* [Scoop](http://scoop.sh) *[OPTIONAL]*. Will be used below for installing several tools.
* [Go Programming Language](https://golang.org/doc/install) - `scoop install go`.
* Bash: either using [Git Bash](https://msysgit.github.io/) or [Busybox for Windows](http://intgat.tigress.co.uk/rmy/busybox/index.html) - `scoop install busybox`.
* Powershell (It comes with Windows. You can use cmd if you want but you'll have to adjust the commands yourself).

Install Go
=======

To install go, I used [Scoop](http://scoop.sh) with `scoop install go` (yes, it's that easy! Its like [homebrew](http://brew.sh/) but for Windows), or you can [download their installer](https://golang.org/doc/install) if you please.

Once installed, you should be able to run `go version` from the command line (I'm using Powershell) to see the following:

```go version go1.4.1 windows/amd64```

Set Go Environment Variable
=======================

We need to set the `GOPATH` environment variable for the go install directory: `c:\gopath` or `$env:homepath\AppData\Local\scoop\apps\go\1.4.1` (the last part will depend on your go version from the command above). 

In Powershell set it by running `$env:GOPATH="path/to/go"` for example in my case it was `$env:GOPATH="$env:homepath\AppData\Local\scoop\apps\go\1.4.1"`

NB. Using `$env` in Powershell only lasts for the Powershell session. It would be wise to add `GOPATH` as a permanent envir 

Lets change directories to the GOPATH before we mangle it later.

```
cd $env:GOPATH
```

Get The Docker Source
==================

From the command line you need to run `go get github.com/docker/docker` which will download the docker source into your go code library. 

There are also a couple of other environment variables required for compiling docker:

```
$env:DOCKER_CLIENTONLY=1

# This is the mangling of the GOPATH that I was talking about
$env:GOPATH="$env:GOPATH\src\github.com\docker\docker\vendor;$env:GOPATH"
```

Notice that we extended `GOPATH` variable, paying particular attention to the order of the path, which places the vendor directory before the original `GOPATH`.

Compile go-autogen
================

For this step you'll need a copy of Bash. If you use GitHub for Windows, you can use Git Bash, or if you have Scoop, you can run `scoop install busybox` which comes with Bash.

Then run the following:

```
# You should be at the GOPATH directory at this point
cd src\github.com\docker\docker
bash .\project\make\.go-autogen
```

Finally, Compile Docker
===================

```
# You're already at GOPATH\src\github.com\docker\docker
# But we need to go deeper!
cd docker
go build -v
```

You should then have a nice new `docker.exe` file in the current directory. You can add this directory to your `PATH` or alternatively run `shim ./docker.exe` if you have shim from scoop installed (`scoop install shim`).

![Silvrback blog image](https://silvrback.s3.amazonaws.com/uploads/f8db13ad-a8ad-4827-b489-9f55dd1fb264/Screenshot%202015-03-10%2016.49.32_large.png)

You still need a Virtual Machine interface like [Boot2Docker](http://boot2docker.io/) or [docker-machine](https://github.com/docker/machine). Having the  docker client doesn't mean that the docker daemon runs on Windows yet. 

If you configure `DOCKER_HOST` to point to your docker instance (whether on a server or running in a VM) you can now use the docker client natively on Windows to interface with it. 

Have fun!