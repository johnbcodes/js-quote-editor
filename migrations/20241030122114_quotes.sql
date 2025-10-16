-- +goose Up
-- +goose StatementBegin
create table quotes (
	id text not null primary key,
	name text not null,
	created_at timestamp with time zone default timezone('utc'::text, now()) not null,
	updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

insert into quotes
	(id, name)
values
	('01HE2X4FKPDTVHHB6C2HZD5Z53','First quote'),
	('01HE2X51WKBYSJ7ZPETRB9STCQ','Second quote'),
	('01HE2X5BB7JNHNXP17H9HM7H9C','Third quote');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- +goose StatementEnd