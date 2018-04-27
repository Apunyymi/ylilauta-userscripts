#!/bin/bash

# Automated add, commit, updating commit-ids and committing the result.
# You can also use *.user.js if you want to update all commit-ids.

show_usage() {
	echo -e "Usage: $0 commit-message filename-of-script1 filename-of-script2 etc..."
}

if [ $# -lt 2 ]
then
	show_usage
	exit 1
fi
git add -p
git commit -m "$1"

shift

commit="$(git rev-parse HEAD)"
echo "COMMIT-ID: $commit"
echo "UPDATED LINES:"
while (( "$#" )); do
	original="$(grep $1 script-toggler.user.js)"
	if [ -n "$original" ]; then
		updated="$(echo $original | sed 's/raw\/.*\/script-toggler/raw\/'$commit'\/script-toggler/g')"
		sed -i "s|$original|$updated|g" script-toggler.user.js || echo "$1 was not found in script-toggler.user.js"
		echo $updated
	else
		echo "$1 was not found in script-toggler.user.js"
	fi
	shift
done

versionstring="$(grep @version script-toggler.user.js)"
if [ -n "$versionstring" ]; then
	current_subversion="${versionstring##*.}"
	next_subversion=$((current_subversion+1))
	updatedversion="$(echo $versionstring | sed 's/\(.*\)./\1'$next_subversion'/')"

	sed -i "s|$versionstring|$updatedversion|g" script-toggler.user.js
	echo $updatedversion
fi

git add script-toggler.user.js
git commit -m 'Commit-ID:t pääskriptiin.'
exit 0
