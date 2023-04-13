<?php

namespace Todo;

use WP_REST_Request;
use WP_REST_Response;

class TodoController
{
  static function init()
  {
    register_rest_route('todo/v1', '/todos', [
      'methods' => 'GET',
      'callback' => 'Todo\TodoController::all',
      'permission_callback' => function () {
        return true;
      }
    ]);
    register_rest_route('todo/v1', '/todos/(?P<id>\d+)', [
      'methods' => 'GET',
      'callback' => 'Todo\TodoController::get',
      'permission_callback' => function () {
        return true;
      }
    ]);
    register_rest_route('todo/v1', '/todos', [
      'methods' => 'POST',
      'callback' => 'Todo\TodoController::post',
      'permission_callback' => function () {
        return true;
      }
    ]);
    register_rest_route('todo/v1', '/todos/(?P<id>[\d]+)', [
      'methods' => 'DELETE',
      'callback' => 'Todo\TodoController::delete',
      'permission_callback' => function () {
        return true;
      }
    ]);
  }

  static function all(WP_REST_Request $request)
  {
    $qp = $request->get_query_params();
    $page = array_key_exists('page', $qp) && is_numeric($qp['page']) ? intval($qp['page']) : 1;
    if ($page < 1) {
      return TodoController::make400Response('InvalidPage');
    }

    $worker = new TodoDbWorker();
    $data = $worker->all($page);

    return TodoController::make200Response($data);
  }

  static function get(WP_REST_Request $request)
  {
    $params = $request->get_params();
    $id = intval($params['id']);

    $worker = new TodoDbWorker();
    $data = $worker->get($id);
    if (!$data) return TodoController::make400Response('NotFound');

    return TodoController::make200Response($data);
  }

  static function post(WP_REST_Request $request)
  {
    $body = $request->get_body_params();
    $text = $body['text'];
    if (!$text) {
      return TodoController::make400Response('InvalidBody');
    }

    $worker = new TodoDbWorker();
    $worker->create(['text' => $text]);

    return TodoController::make200Response();
  }

  static function delete(WP_REST_Request $request)
  {
    $params = $request->get_params();
    $id = intval($params['id']);

    $worker = new TodoDbWorker();
    $worker->destroy($id);

    return TodoController::make200Response();
  }

  static private function make400Response($message = '')
  {
    $response = new WP_REST_Response($message);
    $response->set_status(400);
    return $response;
  }

  static private function make200Response($data = 200)
  {
    $response = new WP_REST_Response($data);
    $response->set_status(200);
    return $response;
  }
}
