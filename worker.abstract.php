<?php

namespace Todo;

interface WorkerAbstract
{
  /**
   * テーブルを作成する
   */
  public function setup_table(): void;
  /**
   * テーブルを削除する
   */
  public function destroy_table(): void;

  /**
   * データを追加する
   * @example
   *  $worker->create(['text' => $text]);
   */
  public function create(array $data): void;

  /**
   * IDで指定したTodoを削除する
   */
  public function destroy(int $id): void;

  /**
   * IDで指定したTodoを取得してオブジェクトとして返す
   */
  public function get(int $id): object | null;

  /**
   * ページネーション用でTodoを取得する
   */
  public function all(int $page, int $limit, string $order): array;
}
