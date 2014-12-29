# Makefile from http://wonko.com/post/simple-makefile-to-minify-css-and-js

# Patterns matching JS files that should be minified. Files with a -min.js
# suffix will be ignored.
JS_FILES = $(filter-out %-min.js,$(wildcard \
	js/*.js \
	js/**/*.js \
))

# Command to run to execute the YUI Compressor.
YUI_COMPRESSOR = yui-compressor

# Flags to pass to the YUI Compressor for JS.
YUI_COMPRESSOR_FLAGS = --charset utf-8 --verbose

JS_MINIFIED = $(JS_FILES:.js=-min.js)

# target: minify - Minifies JS.
minify: minify-js

# target: minify-js - Minifies JS.
minify-js: $(JS_FILES) $(JS_MINIFIED)

%-min.js: %.js
	@echo '==> Minifying $<'
	$(YUI_COMPRESSOR) $(YUI_COMPRESSOR_FLAGS) --type js $< >$@
	@echo

# target: clean - Removes minified JS files.
clean:
	rm -f $(JS_MINIFIED)

# target: help - Displays help.
help:
	@egrep "^# target:" Makefile
