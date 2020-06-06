import React, {useEffect, useState, FormEvent, ChangeEvent} from 'react'
import './styles.css'
import {Link, useHistory} from 'react-router-dom'
import {Map, TileLayer, Marker} from 'react-leaflet'
import {LeafletMouseEvent} from 'leaflet'
import axios from 'axios'
import api from '../../services/api'

import logo from '../../assets/logo.svg'
import {FiArrowLeft} from 'react-icons/fi'
import Dropzone from '../../components/Dropzone'

interface Item {
    id: number,
    title: string,
    image_url: string
}

interface IBGEUFResponse {
    sigla: string
}

interface IBGECityResponse{
    nome: string
}
const CreatePoint = () => {

    const history = useHistory()
    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [citys, setCitys] = useState<string[]>([])

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })
    const [selectItems, setSelectItems] = useState<number[]>([])

    const [selectUf, setSelectUf] = useState('0')
    const [selectCity, setSelectCity] = useState('0')
    const [initialPositionMap, setInitialPositionMap] = useState<[number, number]>([0,0])
    const [selectPostionMap, setSelectPostionMap] = useState<[number, number]>([0,0])
    const [selectedFile, setSelectedFile] = useState<File>()

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords

            setInitialPositionMap([latitude, longitude])
        })
    })

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, [])

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufNames = response.data.map(uf => uf.sigla)
            setUfs(ufNames)
        })
    }, [])

    useEffect(() => {
        if(selectUf === '0'){
            return
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectUf}/municipios`).then(response => {
            const cityNames = response.data.map(city => city.nome)
            setCitys(cityNames) 
        })

    }, [selectUf])

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const select = event.target.value
        setSelectUf(select)
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const select = event.target.value
        setSelectCity(select)
    }

    function handleMapClick (event: LeafletMouseEvent) {
        setSelectPostionMap([event.latlng.lat, event.latlng.lng])
    }

    function handleInputElement (event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target
        setFormData({ ...formData, [name]: value})
    }

    function handleSelectItem (id: number) {

        const jaSelectionado = selectItems.findIndex(item => item === id)
        if(jaSelectionado >= 0){
            const filterItemsSelected = selectItems.filter(item => item != id)

            setSelectItems(filterItemsSelected)
        } else {
            setSelectItems([...selectItems, id])
        }
    }

    async function  handleSubmit (event: FormEvent){
        event.preventDefault()

        const {name, email, whatsapp} = formData
        const uf = selectUf
        const city = selectCity
        const [latitude, longitude] = selectPostionMap
        const items = selectItems

        const data = new FormData()
            data.append('name', name)
            data.append('email', email)
            data.append('whatsapp', whatsapp)
            data.append('uf', uf)
            data.append('city', city) 
            data.append('latitude', String(latitude)) 
            data.append('longitude', String(longitude)) 
            data.append('items', items.join(','))
            if(selectedFile){
                data.append('image', selectedFile)
            }

        console.log(data)

        await api.post('points', data)

        alert('Ponto de coleta criado')

        history.push('/')

    }
    
    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"></img>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/>ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedFile}/>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome do local</label>
                        <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={handleInputElement}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                            type="email"
                            name="email"
                            id="email"
                            onChange={handleInputElement}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">WhatsApp</label>
                            <input
                            type="text"
                            name="whatsapp"
                            id="whatsapp"
                            onChange={handleInputElement}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione um endereço no mapa</span>
                        </legend>    

                        <Map center={initialPositionMap} zoom={15} onclick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <Marker position={selectPostionMap}/>
                        </Map>

                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="uf">Estado (UF)</label>
                                <select name="uf" id ="uf" value={selectUf} onChange={handleSelectUf}>
                                    <option value="0">Selecione uma UF</option>
                                    {ufs.map(uf => (
                                        <option key={uf} value={uf}>{uf}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label htmlFor="cidade">Cidade</label>
                                <select name="cidade" id ="cidade" value={selectCity} onChange={handleSelectCity}>
                                    <option value="0">Selecione uma cidade</option>
                                    {citys.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>    
                    
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo:</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li className={selectItems.includes(item.id) ? 'selected' : ''}
                            key={item.id} onClick={() => handleSelectItem(item.id)}>
                                <img src={item.image_url} alt={item.title}></img>
                                <span>{item.title}</span>
                            </li>
                        ))}
                        
                    </ul>
                </fieldset>
                <button type="submit">Inserir</button>
            </form>
            
        </div>
    )
}

export default CreatePoint