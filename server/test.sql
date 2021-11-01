INSERT INTO fakulte (fakulte_adi) VALUES('Turizm Fakültesi');

INSERT INTO ogretim_uyeleri (isim, soyisim, baslangic_tarih, 
bitis_tarih, email, fakulte_id)

VALUES
('Yusuf', 'A', '17/05/2010','17/05/2025', 'x@gmail.com', '1'),
('Ali', 'Z', '17/05/2010','17/05/2025', 'x@gmail.com', '1'),
('Kemal', 'Z', '17/05/2010','17/05/2025', 'x@gmail.com', '1'),
('Cenk', 'Y', '17/05/2010','17/05/2025', 'x@gmail.com', '1'),
('Esra', 'T', '17/05/2010','17/05/2025', 'x@gmail.com', '1'),
('Kerim', 'V', '17/05/2010','17/05/2025', 'x@gmail.com', '1');


///// kurul üyelerini bulmak için
SELECT ogru_id, concat(isim, ' ', soyisim)"Kurul Uyeleri"
FROM ogretim_uyeleri WHERE fakulte_id = '1' AND bitis_tarih > CURRENT_TIMESTAMP
AND baslangic_tarih < CURRENT_TIMESTAMP;

//kuruldakiker
INSERT INTO yonetim_kurulu (kuruldakiler, fakulte_id)
VALUES (
    ('Yusuf A, Ali Z, Kemal Z, Esra T, Kerim V'), '1');

UPDATE yonetim_kurulu SET kuruldakiler = ('Yusuf A, Ali Z, Kemal Z, Cenk Y, Esra T, Kerim V') where yonetim_kurulu_id=1;


