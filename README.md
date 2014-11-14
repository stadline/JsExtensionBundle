JsExtensionBundle
=================

 1. Add JsExtensionBundle to your dependencies:

        // composer.json

        {
           // ...
           "require": {
               // ...
               "stadline/js-extension-bundle": "~1.0"
           }
        }

 2. Use Composer to download and install JsExtensionBundle:

        $ php composer.phar update stadline/js-extension-bundle

 3. Register the bundle in your application:

        // app/AppKernel.php

        class AppKernel extends Kernel
        {
            // ...
            public function registerBundles()
            {
                $bundles = array(
                    // ...
                    new StadLine\JsExtensionBundle\StadLineJsExtensionBundle(),
                );
            }
        }
