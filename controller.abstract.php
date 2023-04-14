<?php

namespace Todo;

use WP_REST_Request;
use WP_REST_Response;

interface TodoControllerAbstract {
  /**
   * WPにパスを登録する
   */
  static function init(): void;

  /**
   * ページネーションでTodoをJSON配列で返す
   */
  static function all(WP_REST_Request $request): WP_REST_Response;

  /**
   * IDで指定したTodoをJSONオブジェクトで返す
   */
  static function get(WP_REST_Request $request): WP_REST_Response;

  /**
   * フォームデータを受け取ってTodoを保存する
   * 成功時に200を返すのみ
   */
  static function post(WP_REST_Request $request): WP_REST_Response;

  /**
   * IDで指定したTodoを削除する
   * 成功時に200を返すのみ
   */
  static function delete(WP_REST_Request $request): WP_REST_Response;
}
