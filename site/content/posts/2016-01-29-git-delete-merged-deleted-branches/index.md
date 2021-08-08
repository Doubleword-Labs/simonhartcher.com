{
	"slug": "git-delete-merged-deleted-branches",
	"title": "Git: Delete Merged/Deleted Branches",
	"description": null,
	"date": "2016-01-29 12:29:16 +1100"
}

There are many guides out there on how to delete branches from your local git repository that have been merged on the remote. Here I provide a *simple* alias that doesn't make your brain bleed. In our workflow we always delete merged feature branches so this works perfectly for us.

This assumes that you have installed `git-up`. This is only tested using [PyGitUp](https://github.com/msiemens/PyGitUp), and not the original [git-up](https://github.com/aanand/git-up/) so your mileage may vary.

```bash
git up | tail -n+2 | grep "error: remote branch doesn't exist" | awk -F' ' '{print $1}' | xargs -n 1 git branch -d
```

I have this aliased as `git dm` (for "delete missing" or "delete merged"). 

PS. If you didn't have `git-up` already, you're welcome. It's awesome.