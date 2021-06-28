use taskstodo

create table users (
    iduser int identity not null,
    username varchar(50) not null,
    password varchar(50) not null,
    constraint iduser primary key (iduser)
)

create table projects (
    idproject int not null identity,
    iduser int not null,
    name varchar(60) not null,
    constraint projects_pk primary key (idproject),
    constraint projects_users_fk foreign key (iduser) references users (iduser)
)

create table tasks (
    idtask int not null identity,
    idproject int not null,
    description varchar(200) not null,
    finished bit not null,
    created_at date,
    CONSTRAINT pk_pk primary key (idtask),
    constraint tasks_projects_fk foreign key (idproject) references projects (idproject)
)

select * from projects_pk