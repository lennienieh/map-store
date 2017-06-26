dev:
	fis3 release dev -wL

clean:
	fis3 server clean
	rm -rf ./dist

release:
	fis3 release prod -d ./dist
