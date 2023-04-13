<?php

/**
 * Plugin Name:       Todo Api Block
 * Description:       A simple Todo API coupled with a web component block component
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Austin J. Mayer
 * License:           MIT
 * Text Domain:       todo-api-block
 */

namespace Todo;

include('worker.php');
include('controller.php');

use Todo\TodoDbWorker;

/**
 * Registers all block assets so that they can be enqueued through the block editor
 * in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/applying-styles-with-stylesheets/
 */
function create_block_todo_api_block_init()
{
	$dir = __DIR__;

	$index_js = 'build/index.js';
	wp_register_script(
		'create-block-todo-api-block-editor-lit',
		plugins_url($index_js, __FILE__),
		array(
			'wp-block-editor',
			'wp-blocks',
			'wp-i18n',
			'wp-element',
		),
		filemtime("$dir/$index_js"),
		true
	);
	wp_set_script_translations('create-block-todo-api-block-editor-lit', __NAMESPACE__ . '\todo-api-block');

	register_block_type(
		$dir,
		[
			'script' => 'create-block-todo-api-block-editor-lit',
		]
	);
}
add_action('init', __NAMESPACE__ . '\create_block_todo_api_block_init');

function add_importmap_script()
{
?>
	<script type="importmap">
		{
			"imports": {
				"lit": "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js",
				"lit/": "https://cdn.jsdelivr.net/npm/lit@2.7.0/",
				"@lit/reactive-element/decorators/": "https://cdn.jsdelivr.net/npm/@lit/reactive-element@1.6.1/decorators/",
        "lit-html/": "https://unpkg.com/lit-html@2.7.2/",
				"rxjs": "https://cdn.jsdelivr.net/npm/rxjs@7.8.0/+esm"
			}
		}
	</script>
<?php
}
add_action('admin_head', __NAMESPACE__ . '\add_importmap_script');

function setup_todo_table()
{
	$worker = new TodoDbWorker();
	$worker->setup_table();
}
register_activation_hook(__FILE__, __NAMESPACE__ . '\setup_todo_table');

function destroy_todo_table()
{
	$worker = new TodoDbWorker();
	$worker->destroy_table();
}
register_deactivation_hook(__FILE__, '\destroy_todo_table');
add_action('rest_api_init', __NAMESPACE__ . '\TodoController::init');

function add_type_module_tag(string $tag, string $handle, string $src): string
{
	if (str_contains($handle, 'lit') || str_contains($handle, 'svelte')) {
		return "<script type=\"module\" src=\"$src\" defer></script>";
	}
	return $tag;
}
add_filter('script_loader_tag', __NAMESPACE__ . '\add_type_module_tag');
