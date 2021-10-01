drop table if exists `user`;
create table `user`
(
	`id`           int unsigned auto_increment,
	`user_name`    varchar(32)  not null,
	`nickname`     varchar(32)  not null,
	`avatar`       varchar(256) not null,
	`high_score`   int(8)       not null,
	`pwd`          varchar(36)  not null,
	`email`        varchar(48)  not null,
	`game_data`    varchar(512),
	`gmt_created`  datetime,
	`gmt_modified` datetime,
	primary key (`id`)
) engine = InnoDB
  default charset = utf8mb4;