import ReactDOM from 'react-dom';
import React from 'react';
import './styles.css';

class FormularioBusqueda extends React.Component {
    constructor(props) { 
        super(props);
        this.state = {
            usuario: props.usuario,
            incluirMiembro: props.incluirMiembro
        }
    }

    handleUsuario(ev) {
        this.setState({ usuario: ev.target.value});
    }

    handleIncluirMiembro(ev) {
        this.setState({ incluirMiembro: ev.target.checked });
    }

    handleSubmit(ev) {
        ev.preventDefault();
        this.props.onBuscar({
            usuario: this.state.usuario,
            incluirMiembro: this.state.incluirMiembro
        });
    }

    render() {
        return <form className="formulario-busqueda" onSubmit={(ev)=> this.handleSubmit(ev)}>
            <input 
                className="input-usuario"
                type="text"
                value={this.state.usuario}
                onChange={(ev)=> this.handleUsuario(ev)}
            />
            <button className="formulario-submit" type="submit">Buscar</button>
            <label className="check-miembro">
                <input 
                    type="checkbox"
                    checked={this.state.incluirMiembro}
                    onChange={(ev)=> this.handleIncluirMiembro(ev)}
                /> Incluir repositorios donde el usuario es miembro
            </label>
        </form>;
    }
}

class ItemResultado extends React.Component {
    
    render() {
        const resultado = this.props.resultado;
        return <li className="resultado">
            <h3>
                <a href={resultado.html_url} >
                    {resultado.name}
                </a> {resultado.provate && <span className="resultado-privado">Privado</span>}
            </h3>
            <p className="resultado-info">
                {resultado.fork && <span className="resultado-fork">
                    <i className="fa fa-code-fork"/> Forkeado
                </span>}
            </p>
            <p className="resultado-descripcion">{resultado.description}</p>
            <p className="resultado-actualizado"> Actualizado {resultado.updated_at}</p>
            <div className="resultado-stats">
                <span className="resultado-stat">
                    {resultado.language}
                </span>
                <span className="resultado-stat">
                    <i className="fa fa-code-fork"/>{resultado.forks_count}
                </span>
                <span className="resultado-stat">
                    <i className="fa fa-start"/>{resultado.stargazers_count}
                </span>
                <span className="resultado-stat">
                    <i className="fa fa-aye"/>{resultado.watchers_count}
                </span>
            </div>
        </li>;
    }
}

class Resultados extends React.Component {
    render() {
        // const resultado = this.props.resultados;
        return <ul className="resultados-lista">
                {this.props.resultados.map((resultado) => {
                    return <ItemResultado key={resultado.id} resultado={resultado} />;
                })}
            </ul>;
    }
}

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            resultados: [],
            usuario: 'gaearon',
            incluirMiembro: false
        }; 
    }

    componentDidMount() {
        this.buscarResultados(this.state);
    }

    cambiarCriterioBusqueda(state) {
        this.setState(state);
        this.buscarResultados(state);
    }

    buscarResultados(params) { 
        let url = 'https://api.github.com/users/' + params.usuario + '/repos?sort=updated';
        // https://api.github.com/users/petehunt/repos
        if(params.incluirMiembro) {
            url += '&type=all';
        }
        
        fetch(url).then((response) => {
            if(response.ok) { 
                response.json().then((body) => {
                    this.setState({resultados: body});
                });
            } else {
                this.setState({resultados: [] });
            }
        });
    }

    render() {
        return <div className="app">
            <FormularioBusqueda
                usuario={this.state.usuario}
                incluirMiembro={this.state.incluirMiembro} 
                onBuscar={(ev) => this.cambiarCriterioBusqueda(ev)}
                />

            <Resultados resultados={this.state.resultados} />

        </div>
    }
}


ReactDOM.render(<App />, document.getElementById('root'));


// https://api.github.com/users/petehunt/repos