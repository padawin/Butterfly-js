# deploy: build the js in a single minimised file in dist/butterfly.min.js
deploy:
	node deploy.js

# target: clean - Removes minified JS files.
clean:
	rm -rf dist

# target: help - Displays help.
help:
	@egrep "^# target:" Makefile
