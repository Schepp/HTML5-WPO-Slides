<!doctype html>
<!--[if IE 8]> <html class="no-js lt-ie9" lang="de"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="de"> <!--<![endif]-->
<head>
	<title><?php echo html($site->title()) ?> - <?php echo html($page->title()) ?></title>
	<meta charset="utf-8" />
    <link href="//fonts.googleapis.com/css?family=Gudea:400,700,400italic" rel="stylesheet" type="text/css">
    <?php echo css('assets/stylesheets/screen'.(c::get('environment','development') == 'production' ? '.min' : '').'.css') ?>
    <meta name="viewport" content="width=device-width, user-scalable=no" id="viewport">
    <meta name="description" content="<?php echo html($site->description()) ?>" />
    <meta name="robots" content="index, follow" />
    <link rel="shortcut icon" href="<?php echo url('assets/images/favicon.ico') ?>" />
    <link rel="icon" href="<?php echo url('assets/images/favicon.ico') ?>" />
    <link rel="apple-touch-icon" href="<?php echo u('assets/images/apple-touch-icon.png') ?>" />
</head>
<body>
	<div class="">
		<div class="header">
			<a href="./" class="logo"></a>
		</div>
	</div>
    <?php snippet('menu'); ?>
    <div class="wrapper">
