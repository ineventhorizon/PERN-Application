CREATE DATABASE proje;

create table fakulte(
  fakulte_id serial primary key,
  fakulte_adi varchar(50) not null
);



create table ogretim_uyeleri(
  ogru_id serial primary key,
  isim varchar(50) not null,
  soyisim varchar(50) not null,
  baslangic_tarih timestamp not null,
  bitis_tarih timestamp not null,
  email varchar(100) not null,
  fakulte_id int not null, 
  foreign key(fakulte_id) references fakulte(fakulte_id) 
);
  
create table yonetim_kurulu(
  yonetim_kurulu_id serial primary key,
  kuruldakiler text[],
  fakulte_id int not null, 
  foreign key(fakulte_id) references fakulte(fakulte_id) 
);


create table gundemler(
  gundem_id serial primary key,
  gundem text[],
  yonetim_kurulu_id int not null,
  foreign key(yonetim_kurulu_id) references yonetim_kurulu(yonetim_kurulu_id)
);

create table kararlar(
  karar_id serial primary key,
  karar text[],
  gundem_id int not null,
  yonetim_kurulu_id int not null,
  foreign key(gundem_id) references gundemler(gundem_id),
  foreign key(yonetim_kurulu_id) references yonetim_kurulu(yonetim_kurulu_id)
);


create table fyk_toplanti(
  fyk_id serial primary key,
  tarih timestamp not null,

  yonetim_kurulu_id int not null,
  fakulte_id int not null,
  gundem_id int not null,
  karar_id int not null,

  foreign key(yonetim_kurulu_id) references yonetim_kurulu(yonetim_kurulu_id),
  foreign key(fakulte_id) references fakulte(fakulte_id),
  foreign key(gundem_id) references gundemler(gundem_id),
  foreign key(karar_id) references kararlar(karar_id)  
);
