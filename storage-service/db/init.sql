WITH rows AS (
   insert into users(name, surname, male, email) values('admin', 'admin', 'M', 'admin@example.com')
    RETURNING id
)
INSERT INTO credentials ("idUser", username, password, role)
values((SELECT id FROM rows), 'admin', '$2a$08$RfxlaF8/jT.Fxw8BYuXqfexN5VF9Mm7V.lFSrotzIwXRHKGcKpNji', 'A')


WITH rows AS (
   insert into users(name, surname, male, email) values('user', 'user', 'M', 'user@example.com')
    RETURNING id
)
INSERT INTO credentials ("idUser", username, password, role)
values((SELECT id FROM rows), 'user', '$2a$08$skGl71AFJvTS0RyJAZ6rYuRBqLZWP6rE64O6DtAmadq.sLz897uNW', 'U')