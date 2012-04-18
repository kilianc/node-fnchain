REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha test/*-test.js --reporter $(REPORTER)

test-cov:
	$(MAKE) lib-cov
	@FNCHAIN_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html
	@open -g coverage.html

lib-cov:
	@rm -rf lib-cov
	@jscoverage lib lib-cov

.PHONY: test test-cov lib-cov