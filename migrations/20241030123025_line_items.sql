-- +goose Up
-- +goose StatementBegin
create table line_items (
    id text not null primary key,
    line_item_date_id text not null,
    name text not null,
    description text,
    quantity integer not null,
    unit_price decimal(10,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    foreign key(line_item_date_id) references line_item_dates(id)
);

create index idx_line_item_date_id on line_items (line_item_date_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- +goose StatementEnd