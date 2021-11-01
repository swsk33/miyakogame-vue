drop table if exists `player`;
create table `player`
(
	`id`           int unsigned auto_increment,
	`username`     varchar(32)  not null unique,
	`password`     varchar(64)  not null,
	`nickname`     varchar(32)  not null,
	`avatar`       varchar(256) not null,
	`high_score`   int(8)       not null,
	`email`        varchar(48)  not null,
	`game_data`    varchar(512),
	`gmt_created`  datetime,
	`gmt_modified` datetime,
	primary key (`id`)
) engine = InnoDB
  default charset = utf8mb4;