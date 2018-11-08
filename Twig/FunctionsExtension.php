<?php

namespace StadLine\JsExtensionBundle\Twig;

use Symfony\Component\Finder\Finder;
use Symfony\Component\Finder\SplFileInfo;

class FunctionsExtension extends \Twig_Extension
{
    private $kernelRootDir;
    private $serializer;

    public function __construct($kernelRootDir)
    {
        $this->kernelRootDir = $kernelRootDir;
    }

    public function setSerializer($serializer)
    {
        $this->serializer = $serializer;
    }

    public function getName()
    {
        return 'stadline_js_extension_functions_extension';
    }

    public function getFunctions()
    {
        return array(
            new \Twig_SimpleFunction('inline_templates', array($this, 'inlineTemplatesFunction'), array('is_safe' => array('html'))),
            new \Twig_SimpleFunction('serialize_context', array($this, 'serializeContextFunction'), array('is_safe' => array('js'))),
        );
    }

    /**
     * Function to get include JS templates
     */
    public function inlineTemplatesFunction($path)
    {
        $pathinfo = pathinfo($path);
        $templateDir = $this->kernelRootDir.'/../web/'.$pathinfo['dirname'];

        if (!is_readable($templateDir)) {
            return;
        }

        $finder = new Finder();
        $finder->files()->name($pathinfo['filename']);

        $output = '';
        foreach ($finder->in($templateDir) as $file) {
            $output .= $this->getScriptTag($file);
        }

        return trim($output);
    }

    private function getScriptTag(SplFileInfo $file)
    {
        if (strpos($file->getRelativePathname(), '.html.twig') === false) {
            return;
        }

        $templateName = str_replace('.', '-', str_replace('.html.twig', '', $file->getRelativePathname()));
        $templateId = $templateName.'-template';
        $templateContent = $file->getContents();
        return '<script type="text/html" id="'.$templateId.'">'."\n".$templateContent."\n".'</script>'."\n";
    }

    /**
     * Function to serialize Twig context to JSON
     */
    public function serializeContextFunction($context)
    {
        $json = array();

        foreach ($context as $key => $value) {
            if (!in_array($key, array('_parent', 'assetic', 'app')) && !preg_match('#sonata#', $key)) {
                try {
                    $serializedValue = $this->serializer->serialize($value, 'json');
                } catch (\JMS\Serializer\Exception\RuntimeException $ex) {
                    $serializedValue = json_encode($value, null, 2);
                }

                if (!empty($serializedValue)) {
                    $json[] = $this->serializer->serialize($key, 'json').':'.$serializedValue;
                }
            }
        }

        return '{'.implode(',', $json).'}';
    }
}