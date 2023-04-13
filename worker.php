<?php

namespace Todo;

class TodoDbWorker
{
  private $wpdb;
  private $table_name = '';
  private $db_version = '1.0';

  function __construct()
  {
    global $wpdb;
    $this->wpdb = $wpdb;
    $this->table_name = $wpdb->prefix . 'todos';
  }

  public function setup_table()
  {
    $charset_collate = $this->wpdb->get_charset_collate();
    $sql = "CREATE TABLE $this->table_name (
    id INT(11) NOT NULL AUTO_INCREMENT,
    created_at TIMESTAMP NOT NULL DEFAULT (UTC_TIMESTAMP),
    text VARCHAR(255) NOT NULL,
    url varchar(55) DEFAULT '' NOT NULL,
    PRIMARY KEY  (id)
    ) $charset_collate;";
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
    add_option("todo_db_version", $this->db_version);
  }

  public function destroy_table()
  {
    $sql = "DROP TABLE IF EXISTS $this->table_name";
    $this->wpdb->query($sql);
  }

  public function insert(array $data)
  {
    $this->wpdb->insert($this->table_name, $data);
  }

  public function all($page = 1, $limit = 10, $order = 'DESC')
  {
    $offset = ($page - 1) * $limit;
    $sql = "SELECT * FROM $this->table_name
    ORDER BY created_at $order
    LIMIT $limit OFFSET $offset;";
    return $this->wpdb->get_results($sql);
  }

  public function get(int $id) {
    $sql = "SELECT * FROM $this->table_name
    WHERE id = $id";
    return $this->wpdb->get_row($sql, 'OBJECT');
  }

  public function create(array $data)
  {
    $this->wpdb->insert($this->table_name, $data);
  }

  public function destroy(int $id) {
    $this->wpdb->delete($this->table_name, ['id' => $id]);
  }
}
