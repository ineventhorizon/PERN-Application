const express = require("express")
const app = express()
const pool = require("./db")

const cors = require("cors")

//middleware
app.use(cors())
app.use(express.json())


//ROUTES



app.post("/yenigundem", async(req, res) =>{
    try {
        
        const {gundemler, yonetim_kurulu_id} = req.body;

        console.log(yonetim_kurulu_id)

        var queryConfig= {
            text: 'INSERT INTO gundemler (gundem, yonetim_kurulu_id) VALUES($1, $2) RETURNING *',
            values : [gundemler, yonetim_kurulu_id]
        }

        var yonetimQuery = {
            text : 'SELECT FROM yonetim_kurulu WHERE yonetim_kurulu_id = $1',
            values : [yonetim_kurulu_id]
        }

       const yeniGundem = await pool.query(queryConfig)

       const yonetimKurulu = await pool.query(yonetimQuery)

       console.log(yonetimKurulu)

        res.json(yeniGundem.rows[0]);
        

    } catch (error) {
        console.log(error.message)
    }
})

//fyk toplantı yarat
app.post("/yenifyk", async(req, res)=>{
    try {
        const {tarih,fakulte_id, gundemler, kararlar} = req.body;
        

        var yonetimKuruluSelectQuery = {
            text: 'SELECT yonetim_kurulu_id FROM yonetim_kurulu WHERE fakulte_id = $1 ',
            values: [fakulte_id]
        }
        //yonetim kurulu id
        const yonetimKuruluid = await pool.query(yonetimKuruluSelectQuery)
        var {yonetim_kurulu_id} = yonetimKuruluid.rows[0]
    
        

        var gundemInsertQuery = {
            text: 'INSERT INTO gundemler (gundem, yonetim_kurulu_id) VALUES($1, $2) RETURNING gundem_id',
            values : [gundemler, yonetim_kurulu_id]
        }
        //gundem id
        const yeniGundem = await pool.query(gundemInsertQuery)
        var {gundem_id} = yeniGundem.rows[0]

       

        var kararInsertQuery = {
            text : 'INSERT INTO kararlar (karar, gundem_id, yonetim_kurulu_id) VALUES($1, $2, $3) RETURNING karar_id',
            values : [kararlar, gundem_id, yonetim_kurulu_id]
        }
        //karar id
        const yeniKarar = await pool.query(kararInsertQuery)
        var {karar_id} = yeniKarar.rows[0]

      
        

        var fykInsertQuery = {
            text: 'INSERT INTO fyk_toplanti (tarih, yonetim_kurulu_id, fakulte_id, gundem_id, karar_id) VALUES($1, $2, $3, $4, $5) RETURNING *',
            values: [tarih, yonetim_kurulu_id, fakulte_id, gundem_id, karar_id]
        }

        const yeniFYK_toplantisi = await pool.query(fykInsertQuery)

        console.log("Yeni bir toplantı eklendi.")
        res.json(yeniFYK_toplantisi.rows[0])



    } catch (error) {
        console.log(error.message)
    }
})

//fyk toplantılarını listele
app.get("/fyktoplantilari", async(req, res)=>{
    try {
        var fyktoplantilariSelectQuery = {
            text: 'SELECT * from fyk_toplanti'
        }

        const fyktoplantilari = await pool.query(fyktoplantilariSelectQuery)

        for(var i=0; i< fyktoplantilari.rows.length;i++){
            console.log(fyktoplantilari.rows[i].tarih, i)
        }

        res.json(fyktoplantilari.rows)
        
    } catch (error) {
        console.log(error.message)
    }
})

//fakülteleri listele
app.get("/fakulte", async(req, res)=>{
    try {
        var fakulteSelectQuery = {
            text: 'SELECT * from fakulte'
        }
        const fakulteler = await pool.query(fakulteSelectQuery)

        res.json(fakulteler.rows)
    } catch (error) {
        console.error(error.message)
    }
})
//idye göre fyk toplantısı
app.get("/fyktoplantilari/:id", async(req, res)=>{
    try {
        const { id } = req.params

        var fyktoplantisiSelectQuery = {
            text: 'SELECT * FROM fyk_toplanti WHERE fyk_id = $1',
            values: [id]
        }
        const fyktoplantisi = await pool.query(fyktoplantisiSelectQuery)

        //ilgili fyk toplantısının gündemi, kararı, yönetim kurulu, fakültesinin idleri
        var {gundem_id, fakulte_id, karar_id, yonetim_kurulu_id, tarih} = fyktoplantisi.rows[0]

        //ilgili fyk toplantısının içeriğini bulmak için
        var gundemSelectQuery = {
            text: 'SELECT gundem from gundemler WHERE gundem_id = $1',
            values:[gundem_id]
        }

        var fakulteSelectQuery = {
            text: 'SELECT fakulte_adi from fakulte WHERE fakulte_id = $1',
            values: [fakulte_id]
        }

        var kararSelectQuery = {
            text: 'SELECT karar from kararlar WHERE karar_id = $1',
            values: [karar_id]
        }

        var yonetimKuruluSelectQuery = {
            text: 'SELECT kuruldakiler from yonetim_kurulu WHERE yonetim_kurulu_id = $1',
            values: [yonetim_kurulu_id]
        }

        const fyktoplantisiGundem = await pool.query(gundemSelectQuery)
        const fyktoplantisiKuruldakiler = await pool.query(yonetimKuruluSelectQuery)
        const fyktoplantisiKarar = await pool.query(kararSelectQuery)
        const fyktoplantisiFakulteAdi = await pool.query(fakulteSelectQuery)
        

        //ilgili fyk toplantısının 1. gündemi
        console.log(fyktoplantisiGundem.rows[0].gundem[0])

       
        
        var response = {
            id : id ,
            tarih : tarih,
            gundemler : fyktoplantisiGundem.rows[0].gundem,
            kuruldakiler : fyktoplantisiKuruldakiler.rows[0].kuruldakiler,
            kararlar : fyktoplantisiKarar.rows[0].karar,
            fakulte_adi : fyktoplantisiFakulteAdi.rows[0].fakulte_adi
        }


        //yanıt
        //res.json(fyktoplantisi.rows)
        res.send(response)
        
    } catch (error) {
        console.log(error.message)
    }
})

//ilgili fyk toplantısını güncelleme
app.put("/fyktoplantilari/:id", async(req, res)=>{
    try {
        const { id } = req.params
        const {gundemler, kararlar} = req.body;

        //ilgili fyk toplantısının gündem ve karar idleri
        var fyktoplantisiSelectQuery = {
            text: 'SELECT gundem_id, karar_id FROM fyk_toplanti WHERE fyk_id = $1',
            values: [id]
        }
        const fyktoplantisi = await pool.query(fyktoplantisiSelectQuery)
        //ilgili fyk toplantısının gündem ve karar idleri
        var {gundem_id, karar_id} = fyktoplantisi.rows[0]


        var gundemUpdateQuery = {
            text: 'UPDATE gundemler SET gundem = $1 WHERE gundem_id = $2',
            values: [gundemler, gundem_id]
        }

        var kararUpdateQuery = {
            text: 'UPDATE kararlar SET karar = $1 WHERE karar_id = $2',
            values: [kararlar, karar_id]
        }
        
        const gundemUpdate = await pool.query(gundemUpdateQuery)
        const kararUpdate = await pool.query(kararUpdateQuery)

        res.json("SUCCESSFULLY UPDATED")

        
        
    } catch (error) {
        console.log(error.message)
    }
})

app.get("/test", async(req, res) =>{
    try {
        
        var gundemlerQuery={
            text:'SELECT * from gundemler'
        }


        var gundemInsertQuery = {
            text: 'INSERT INTO gundemler (gundem, yonetim_kurulu_id) VALUES($1, $2) RETURNING gundem_id',
            values : [['test gundem', 'test gundem 2'], '1']
        }


        const testGundem_id = await pool.query(gundemInsertQuery)

        var {gundem_id} = testGundem_id.rows[0]
        console.log("gugugugugu" + gundem_id)
        
        //const tumGundemler = await pool.query(gundemlerQuery)
        //console.log(tumGundemler)
        //res.json(tumGundemler.rows)

        res.json(testGundem_id.rows[0]);


    } catch (error) {
        console.log(error)
    }
})



app.listen(5000, ()=>{
    console.log("server has started on port 5000")
})
