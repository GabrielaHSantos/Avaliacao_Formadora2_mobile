import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonSpinner, IonAlert } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dados-api',
  templateUrl: './dados-api.page.html',
  styleUrls: ['./dados-api.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
    IonSpinner, IonAlert
  ]
})
export class DadosApiPage implements OnInit {
  // Lista usada anteriormente na página
  public listaPokemon: any[] = [];
  public listaFiltrada: any[] = [];
  private url = 'https://pokeapi.co/api/v2/pokemon?limit=151';

  // Estado do widget Pokédex (adaptado do código fornecido)
  public pokemonName: string = '';
  public pokemonNumber: number | null = null;
  public pokemonImageUrl: string = '';
  public searchPokemon: number = 1;
  public searchInput: string = '';
  public showNotFoundAlert: boolean = false;
  public notFoundMessage: string = '';

  constructor(private http: HttpClient, private navCtrl: NavController) {}

  ngOnInit() {
    // Carrega a lista para a seção de lista (se mantida)
    this.buscarPokemon();
    // Inicializa a Pokédex com o primeiro Pokémon
    this.renderPokemon(this.searchPokemon);
  }

  goBack() {
    this.navCtrl.back();
  }

  // ---- Lógica original da lista ----
  buscarPokemon() {
    this.http.get<any>(this.url).subscribe((response) => {
      response.results.forEach((pokemon: any) => {
        this.http.get<any>(pokemon.url).subscribe((details) => {
          this.listaPokemon.push(details);
          this.listaPokemon.sort((a, b) => a.id - b.id);
        });
      });
      this.listaFiltrada = this.listaPokemon;
    });
  }

  filtrar(event: any) {
    const termoBusca = (event?.detail?.value || '').toLowerCase();
    if (!termoBusca) {
      this.listaFiltrada = this.listaPokemon;
      return;
    }
    this.listaFiltrada = this.listaPokemon.filter((pokemon) => {
      return pokemon.name.toLowerCase().includes(termoBusca);
    });
  }

  // ---- Adaptação do JS fornecido ----
  // Buscar um único Pokémon por nome ou id
  async fetchPokemon(pokemon: string | number): Promise<any | null> {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
      if (res.status === 200) {
        return await res.json();
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // Renderizar dados do Pokémon na Pokédex
  async renderPokemon(pokemon: string | number) {
    this.pokemonName = 'Loading...';
    this.pokemonNumber = null;

    const data = await this.fetchPokemon(pokemon);

    if (data) {
      const animated = data?.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default;
      const fallback = data?.sprites?.front_default;
      this.pokemonImageUrl = animated || fallback || '';
      this.pokemonName = data.name;
      this.pokemonNumber = data.id;
      this.searchPokemon = data.id;
    } else {
      this.pokemonImageUrl = 'assets/interrogacao.png';
      this.pokemonName = '';
      this.pokemonNumber = null;
      this.notFoundMessage = typeof pokemon === 'number'
        ? `Não encontramos o Pokémon de número ${pokemon}. Tente outro ID ou nome.`
        : `Não encontramos o Pokémon "${pokemon}". Verifique o nome e tente novamente.`;
      this.showNotFoundAlert = true;
    }
  }

  // Submit do formulário de busca dentro da Pokédex
  onSubmit(event: Event) {
    event.preventDefault();
    const value = (this.searchInput || '').trim().toLowerCase();
    if (value) {
      this.renderPokemon(value);
      this.searchInput = '';
    }
  }

  // Botões de navegação
  prev() {
    if (this.searchPokemon > 1) {
      this.searchPokemon -= 1;
      this.renderPokemon(this.searchPokemon);
    }
  }

  next() {
    this.searchPokemon += 1;
    this.renderPokemon(this.searchPokemon);
  }

  onAlertDismiss() {
    this.showNotFoundAlert = false;
    this.notFoundMessage = '';
    this.searchInput = '';
    // Volta para o Bulbasaur (id 1)
    this.searchPokemon = 1;
    this.renderPokemon(1);
  }

}
