const BASE_URL =  'https://effective-xylophone-jppggq7r7gvhq6qv-8080.app.github.dev'


export const buscaPessoa = async() => {
    const response = await fetch(`${BASE_URL}/api/pessoas`,{
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    });

    if (!response.ok) {
        throw new Error('Erro ao buscar pessoas');
    }

    return await response.json()
} 

export const novaPessoa = async(dataPessoa) =>{
    const response = await fetch(`${BASE_URL}/api/pessoas`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(dataPessoa),
    });

    if (!response.ok) {
        throw new Error('Pessoa não encontrada.');
    }
    return await response.json();
}

export const deletePessoa = async(id) => {

    const response = await fetch(`${BASE_URL}/api/pessoas/${id}`,{
        method:'DELETE',
        headers:{
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin': '*',
        }

    });

    if (!response.ok) {
        throw new Error('Pessoa não encontrada.');
    }

    return await response.json();
}