(function () {
  window.config = function () {

    var DIAHOJE = new Date().toLocaleDateString('pt-BR');
    var HORAAGORA = new Date().toLocaleTimeString('pt-BR');
    var QUERY = { tipo: 'Motorista' }

    return {
      title: 'Controle Portaria',
      collections: ['sysMods'],
      libs: ['forms', 'table', 'dashs'],
      io: 'io',
      layout: [
        {// Main
          pageId: 'Main',
          pageType: 'layer',
          params: {
            title: 'Veículos',
            boot: 'syncIO',
            load: [
              { base: 'cadPortaria', model: 'tabela' },
              {
                base: 'cadPortPedestres', model: 'pedestres', filter: { ativo: true, status: { $ne: 'danger' } }, trat: function (data) {
                  for (var x1 in data) {
                    data[x1].title = data[x1].nome;
                    data[x1].text = data[x1].cpf || 'Sem CPF';
                    data[x1].order = data[x1].numero * 1;

                    var hora = new Date(data[x1]._db.time).toLocaleTimeString('pt-BR');
                    data[x1].infos = [
                      (data[x1].tipo),
                      data[x1]._db.timetext,
                      hora
                    ];

                    // data[x1].status = data[x1].op == 'Entrada' ? 'success' : 'danger';
                    data[x1].status = data[x1].tipo == 'Funcionário' ? 'info' : 'warning2'
                    data[x1].icon = 'person';
                    // data[x1].img = data[x1].op=='Entrada'?'success':'danger';
                  }
                  return data;
                }
              }
            ],
            loadLocal: [
              { model: 'tabela', data: [] },
              { model: 'transito', data: [] },
              { model: 'doca', data: [] }
            ],
            header: [
            ],
            menu: [
              { nome: 'Realizar Entrada', icone: 'local_shipping', menuType: 'modal', param: 'entMotorista' },
              { nome: 'Entrada Funcionário', icone: 'account_circle', menuType: 'modal', param: 'entPedestres' },
              { nome: 'Entrada Visitante', icone: 'account_circle', menuType: 'modal', param: 'entVisitantes' },
              { nome: 'Histórico de E/S', icone: 'list', menuType: 'layer', param: 'historicoES' },
            ],
            tabela: [
              { nome: 'Avançar', dataType: 'button', func: 'avancar', icone: 'play_arrow', status: 'success' },
              { nome: 'Senha', field: 'numero' },
              { nome: 'Operação', field: 'op', status: 'status' },
              { nome: 'Status', field: 'stat', status: 'statusColor' },
              { nome: 'Motorista', field: 'nome' },
              { nome: 'CPF', field: 'cpf', mask: 'CPF' },
              { nome: 'Tipo Caminhão', field: 'tipoCaminhao' },
              // {nome:'Status CNH',field:'vencimentoStatus',status:'vencimentoStatusColor'},
              { nome: 'Transportadora', field: 'transp' },
              { nome: 'Hora Entrada', field: 'hEntrada' },
              { nome: 'Hora Saída', field: 'hSaida' },
              { nome: 'Data', field: 'dEntrada' },
              { nome: 'Recusar Entrada', dataType: 'button', func: 'recusar', icone: 'report_off', status: 'danger' },
              { nome: 'Histórico da Entrada', dataType: 'button', func: 'historico', icone: 'access_time', status: 'warning' },
            ],
            pedestres: [
              { nome: 'Nome', field: 'nome' }
            ],

            model: {
              cards: {
                entradaSaida: '0',
                emTransito: '0',
                emDoca: '0'
              }
            }
          },
          componentes: [
            {
              id: 'B', dataType: 'inrouter', size: '12', height: '5%', componentes: [
                {
                  dataType: 'card', size: '12', cards: [
                    { size: 25, noicone: true, font: '1.1', model: 'cards.entradaSaida', content: 'Entrada', status: 'primary', click: 'openMain' },
                    { size: 25, noicone: true, font: '1.1', model: 'cards.emTransitoEntrada', content: 'Em Trânsito', status: 'primary', click: 'openMain' },
                    { size: 25, noicone: true, font: '1.1', model: 'cards.emDoca', content: 'Em Doca', status: 'primary', click: 'openMain' },
                    { size: 25, noicone: true, font: '1.1', model: 'cards.entradaFunc', content: 'Pedestres', status: 'primary', click: 'openMain' },

                    // {size:20,noicone:true,font:'1.1',model:'cards.emTransitoSaida',content:'Em Trânsito (Saída)',status:'primary',click:'openMain'},
                    // {size:25,noicone:true,font:'1.1',model:'cards.Saida',content:'Saída',status:'primary',click:'openMain'},
                  ]
                },
              ]
            },

            { dataType: 'listcard', title: 'Entrada', size: '3', id: 'tabela', table: 'tabela', height: '80%', status: 'status', click: 'openViewPass', click: 'setEntrada' },
            { dataType: 'listcard', title: 'Em Trânsito', size: '3', id: 'transito', table: 'transito', height: '80%', status: 'status', click: 'openView', click: 'setTransito' },
            { dataType: 'listcard', title: 'Em Doca', size: '3', id: 'doca', table: 'doca', height: '80%', status: 'status', click: 'openView', click: '' },
            { dataType: 'listcard', title: 'Pedestres', size: '3', id: 'pedestres', table: 'pedestres', height: '80%', status: 'status', click: 'saidaPedestre' },

            // {dataType:'listcard',title:'Em Trânsito (Saída)',size:'2',id:'transito',table:'transito',height:'80%',status:'status',click:'openView',click:'setTransito'},
            // {dataType:'listcard',title:'Saída',size:'3',id:'transito',table:'transito',height:'80%',status:'status',click:'openView',click:'setTransito'},
          ],
          funcs: {
            syncIO: function (tools) {
              tools.$rootScope.sync.on('portaria', (data) => {
                setTimeout(() =>{
                  console.log('portaria: ', data);
                  tools.$scope.cmdFunc('boot');

                },500)
              });
              tools.$scope.cmdFunc('boot');
            },
            boot: function (tools) {
              console.log('Tools', tools.$scope)
              tools.$scope.cmdFunc('pedestres')
              var entradaSaida = [];
              var transito = [];
              var doca = [];
              var saidaMot = 0;
              tools.services.getData('cadPortaria', { ativo: true, dEntrada: DIAHOJE, tipo: 'Motorista' }, function (result) {
                for (var x1 in result.data) {
                  //Cria cria mascara para adicionar no card
                  result.data[x1].title = 'Nome: ' + result.data[x1].nome.split(' ')[0];
                  result.data[x1].sub = 'CPF: ' + result.data[x1].cpf;
                  result.data[x1].text = 'Transp: ' + result.data[x1].transp;
                  result.data[x1].order = result.data[x1].numero * 1;
                  if (result.data[x1].op == 'Entrada') { result.data[x1].status = result.data[x1].stat == 'Aguardando Liberação' ? 'gray' : 'success' }

                  if (result.data[x1].op == 'Em Trânsito') { result.data[x1].status = result.data[x1].stat == 'Em Trânsito' ? 'warning' : 'primary' }

                  if (result.data[x1].op == 'Em Doca' && result.data[x1].stat == 'Em Processo') { result.data[x1].status = 'warning2' }
                  if (result.data[x1].op == 'Em Doca' && result.data[x1].stat == 'Processo Finalizado') { result.data[x1].status = 'success' }

                  if (result.data[x1].op == 'Saída') { result.data[x1].status = 'primary' }
                  if (result.data[x1].stat == 'Entrada Recusada') { result.data[x1].status = 'danger' }

                  var time = new Date(result.data[x1]._db.time).toLocaleTimeString('pt-br');
                  var dia = new Date(result.data[x1]._db.time).toLocaleDateString('pt-br');
                  result.data[x1].infos = [
                    result.data[x1].numero,
                    time,
                    dia,

                  ];
                  if (result.data[x1].doca) result.data[x1].infos.push(result.data[x1].doca)

                  result.data[x1].img = 'in.png';
                  if (result.data[x1].tipo == 'Motorista') {
                    if (result.data[x1].stat == 'Processo Finalizado' || result.data[x1].stat == 'Saída Liberada' || result.data[x1].op == 'Saída') { result.data[x1].img = 'out.png'; }
                  }
                }
                var portaria = tools.dataForm(result.data);
                //Separa por tipo
                for (var x1 in portaria) {
                  if (portaria[x1].tipo == 'Motorista') {
                    if (portaria[x1].op == 'Entrada') { entradaSaida.push(angular.copy(portaria[x1])); }
                    // if(portaria[x1].op == 'Saída'){entradaSaida.push(angular.copy(portaria[x1]));saidaMot++}
                    if (portaria[x1].op == 'Em Trânsito') { transito.push(angular.copy(portaria[x1])); }
                    if (portaria[x1].op == 'Em Doca') { doca.push(angular.copy(portaria[x1])); }
                  }
                }

                //Contador Cards
                var totalMotoristas = entradaSaida.length;
                var totalFuncionarios = transito.length;
                var totalVisitantes = doca.length;

                tools.$scope.item['cards.entradaSaida'] = totalMotoristas + '';
                tools.$scope.item['cards.Saida'] = saidaMot + '';
                tools.$scope.item['cards.emTransitoEntrada'] = totalFuncionarios + '';
                tools.$scope.item['cards.emDoca'] = totalVisitantes + '';
                // tools.$scope.item['cards.emTransitoSaida']=totalFuncionarios+'';


                tools.$scope.load.tabela = entradaSaida;
                tools.$scope.load.transito = transito;
                tools.$scope.load.doca = doca;


                //  if(tools.$scope.load.tabela.length==0){
                //    var processo = tools.$scope.load.processo.length>0?tools.$scope.load.processo[0]:{tipo:'senha',code:1};
                //    processo.code=1;
                //    var proc = tools.itemObj(processo);
                //    tools.services.save(proc,'sysProcesso',function(result){});
                //  }
              });
            },
            setEntrada: function (tools, idx) {
              var item = tools.$scope.load.tabela[idx];
              if (tools.$scope.load.tabela[idx].status == 'gray') { alert('Aguarde a liberação da entrada.'); return; }
              if (tools.$scope.load.tabela[idx].status == 'danger') { 
                var x = confirm('Deseja liberar a saída deste veículo?');
                if (!x) { return }
                item.finalizado = true
                item.op = 'Saída'
                item.stat = 'Entrada Recusada'
                item.hSaida = HORAAGORA;
                item.dSaida = DIAHOJE;
                tools.$rootScope.sync.emit('portaria', { senha: item.numero, op: item.op, stat: item.stat, status: 'danger' });
                var proc = tools.itemObj(item);
                tools.services.save(proc, 'cadPortaria', function (result) {
                  tools.$rootScope.setLayout('Main');
                });
                return
              }

              var x = confirm('Deseja liberar a entrada do veículo?');
              if (!x) { return }


              item.hEntrada = HORAAGORA;
              item.dEntrada = DIAHOJE;
              item.op = 'Em Trânsito';
              item.stat = 'Em Trânsito';

              tools.$rootScope.sync.emit('portaria', { senha: item.numero, op: item.op, stat: item.stat });

              var proc = tools.itemObj(item);
              tools.services.save(proc, 'cadPortaria', function (result) {
                tools.$rootScope.setLayout('Main');
              });
            },
            setTransito: function (tools, idx) {
              var item = tools.$scope.load.transito[idx];
              if (item.stat == 'Em Trânsito') {
                alert('Este veículo está no processo de entrada.'); return
              } else {
                var x = confirm('Deseja liberar a saída deste veículo?');
                if (!x) { return }
                item.finalizado = true
                item.op = 'Saída'
                item.stat = 'Finalizada'
                tools.$rootScope.sync.emit('portaria', { senha: item.numero, op: item.op, stat: item.stat });

              }

              var proHistc = tools.itemObj(item);
              tools.services.save(proHistc, 'cadPortaria', function (result) {
                tools.$rootScope.sync.emit('portaria', { senha: item.numero, op: item.op, stat: item.stat });
                tools.$rootScope.setLayout('Main');
              });
            },
            setDoca: function (tools, idx) {
              var item = tools.$scope.load.doca[idx];
              var x = confirm('Veículo em trânsito?');
              if (!x) { return }
              item.op = 'Em Trânsito';
              item.stat = 'saindo';

              var proc = tools.itemObj(item);
              tools.services.save(proc, 'cadPortaria', function (result) {
                tools.$rootScope.sync.emit('portaria', { senha: item.numero, op: item.op, stat: item.stat });
                tools.$rootScope.setLayout('Main');
              });
            },
            header: function (tools, value) {
              if (value == 'Funcionários/Visitantes') { tools.$rootScope.setLayout('Pedestres') }
              if (value == 'Veículos') { tools.$rootScope.setLayout('Main') }
            },
            pedestres: function (tools, value) {
              var pedestres = tools.$scope.load.pedestres;
              var totalPedestres = pedestres.length;
              tools.$scope.item['cards.entradaFunc'] = totalPedestres + ''

            },
            saidaPedestre: function (tools, params) {
              console.log('entrou', params)
              let pedestre = tools.$scope.load.pedestres[params]
              let confirmacao = confirm(`O pedestre ${pedestre.nome} saiu ?`)
              if (!confirmacao) {
                return
              }
              pedestre.status = 'danger'
              pedestre.stat = 'Saida'
              pedestre.dSaida = new Date().toLocaleDateString('pt-br')
              pedestre.hSaida = new Date().toLocaleTimeString('pt-br')
              pedestre = tools.itemObj(pedestre)
              tools.services.save(pedestre, 'cadPortPedestres', function (result) {
                tools.$rootScope.setLayout('Main');
              });
            }
          }
        },
        {// entMotorista
          pageId: 'entMotorista',
          pageType: 'modal',
          params: {
            title: 'Entrada de Motorista',
            boot: 'boot',
            load: [
              {
                base: 'cadMotoristas', model: 'motoristas', opt: 'label', trat: function (data) {
                  for (var x1 in data) {
                    data[x1].label = data[x1].nome + ' - ' + data[x1].cpf;
                  }
                  return data;
                }
              },
              { base: 'cadPortaria', model: 'portaria', filter: {ativo:true , dEntrada: DIAHOJE, tipo: 'Motorista',finalizado:{$ne: true} } },
              { base: 'sysProcesso', model: 'processo', filter: {tipo: 'senha' } },
            ],
            menu: [
              { nome: 'Salvar', menuType: 'func', param: 'tosave', icone: 'save', status: 'success' },
              { nome: 'Cancelar', menuType: 'ok', icone: 'close', status: 'grey' },
            ],
            model: {
              numero: '',
              cpf: '',
              nome: '',
              op: 'Entrada',
              stat: 'Aguardando Liberação',
              tipo: 'Motorista',
              transp: '',
              hEntrada: HORAAGORA,
              hSaida: '',
              dEntrada: DIAHOJE,
              dSaida: '',
              aguardando: true,
              show: true,
              ativo: true
            }
          },
          componentes: [
            { dataType: 'title', nome: 'Dados Motorista' },
            { dataType: 'input', nome: 'CPF', model: 'cpf', size: '10', mask: 'CPF' },
            { dataType: 'button', nome: 'Buscar', size: '2', status: 'info', icone: 'search', click: 'buscarMotorista' },
            { dataType: 'input', nome: 'Nome', model: 'nome', size: '3', ifshow: 'show', block: true },
            { dataType: 'input', nome: 'Transportadora', model: 'transp', size: '3', ifshow: 'show', block: true },
            { dataType: 'input', nome: 'Telefone', model: 'telefone', size: '3', ifshow: 'show', mask: 'TELEFONE', block: true },
            { dataType: 'input', nome: 'Nome', model: 'nome', size: '3', ifhide: 'show' },
            { dataType: 'input', nome: 'Transportadora', model: 'transp', size: '3', ifhide: 'show' },
            { dataType: 'input', nome: 'Telefone', model: 'telefone', size: '3', mask: 'TELEFONE', ifhide: 'show' },
            { dataType: 'switchbutton', nome: 'Entrando com mercadoria?', model: 'mercadoria', size: '3', },
          ],
          funcs: {
            header: function (tools) { },
            buscarMotorista: function (tools) {
              let motorista = tools.$scope.load.motoristas.find(e => e.cpf == tools.$scope.item.cpf)
              if (!motorista) {
                alert('Motorista não encontrado, preencha os dados para realizar o registro.');
                tools.$scope.item.show = false;
                tools.$scope.novo = true;
              } else {
                let obj = {
                  cnh: motorista.cnh,
                  vencimento: motorista.vencimento,
                  nome: motorista.nome,
                  telefone: motorista.telefone,
                  transp: motorista.transp,
                  categoria: motorista.categoria,
                  status: motorista.status,
                  caminhao: motorista.caminhao,
                  tipo: motorista.tipo


                }
                tools.$scope.item.show = true;
                tools.$scope.novo = false;
                // var motorista = tools.selOpt('motoristas','cpf',tools.$scope.item.cpf)
                tools.$scope.item.nome = motorista.nome + '';
                tools.$scope.item.transp = motorista['transp'] + '';
                tools.$scope.item.telefone = motorista['telefone'] + '';
                tools.$scope.item.motorista = tools.itemObj(obj)
              }
            },
            tosave: function (tools) {
              if (tools.$scope.item.nome == '' || tools.$scope.item.transp == '' || tools.$scope.item.cpf.length < 11) { alert('Preencha todos os dados do motorista.'); return; }
              if (tools.$scope.novo) {
                console.log('motorista novo')
                var obj = {
                  nome: tools.$scope.item.nome,
                  cnh: '',
                  vencimento: '',
                  status: '',
                  catA: false,
                  catB: false,
                  catC: false,
                  catA: false,
                  catD: false,
                  catE: false,
                  categoria: '',
                  cpf: tools.$scope.item.cpf,
                  telefone: tools.$scope.item.telefone,
                  transp: tools.$scope.item.transp,
                  email: '',
                  caminhao: [],
                  viewModal: 'Dados Pessoais',
                  temp: {
                    modelo: '',
                    marca: '',
                    ano: '',
                    cor: '',
                    eixos: '',
                    tipo: '',
                    placa: '',
                    placa2: '',
                    placa3: '',
                    estado: '',
                    tipo: '',
                  },
                  ativo: true
                }
                var motorista = tools.itemObj(obj);
                tools.services.save(motorista, 'cadMotoristas', function (result) {
                  let motoristaObj = {
                    cnh: motorista.cnh,
                    vencimento: motorista.vencimento,
                    nome: motorista.nome,
                    telefone: motorista.telefone,
                    transp: motorista.transp,
                    categoria: motorista.categoria,
                    status: motorista.status,
                    caminhao: motorista.caminhao,
                    tipo: motorista.tipo

                  }
                  tools.$scope.item.motorista = tools.itemObj(motoristaObj)
                });
              }
              //gera hora Entrada
              tools.$scope.item.entrada = new Date().toLocaleString('pt-BR') + '';
              var processo = tools.$scope.load.processo.length > 0 ? tools.$scope.load.processo[0] : { tipo: 'senha', code: 1 };
              let verificaDuplicidade = tools.$scope.load.portaria.findIndex(e => e.cpf == tools.$scope.item.cpf)
              if (verificaDuplicidade > -1) { return alert('Motorista já esta cadastrado') }
              if (!tools.$scope.item._id) {
                tools.$scope.item.numero = ('0000' + processo.code).slice(-4);
                processo.code = processo.code + 1;
                var proc = tools.itemObj(processo);
                console.log('motorista', tools.$scope.item)
                tools.services.save(proc, 'sysProcesso', function (result) {
                  // tools.$rootScope.sync.emit('portaria', {senha:tools.$scope.item.numero})
                  tools.services.insertAll([tools.$scope.item], 'cadPortaria', function (result) {
                    console.log('result', result)
                    tools.$scope.item._id = result.data.ids[0]._id
                    tools.$scope.item.status = 'gray'
                    tools.$scope.item.tipoCaminhao = tools.$scope.item.motorista.caminhao[0] &&  tools.$scope.item.motorista.caminhao[0].tipo? tools.$scope.item.motorista.caminhao[0].tipo : 'N/A'
                    tools.$rootScope.sync.emit('portaria', tools.$scope.item )
                    check = true;
                    tools.$scope.cmd('layout', 'Main');
                    tools.$rootScope.setLayout('Main');
                  });
                });
              } else {
                tools.$scope.cmd('save', { base: 'cadPortaria', layout: 'Main' });
              }
            }
          }
        },
        {// HistoricoES
          pageId: 'historicoES',
          pageType: 'layer',
          params: {
            boot: 'boot',
            title: 'Histórico E/S',
            load: [
              { base: 'cadPortaria', model: 'tabela', filter: { ativo: true } },
              {
                base: 'cadPortPedestres', model: 'pedestres', filter: { ativo: true }, trat: data => {
                  data.map(e => e.hSaida = e.hSaida ? e.hSaida : 'N/A')
                  return data
                }
              }

            ],
            menu: [
              { nome: 'Realizar Entrada', icone: 'local_shipping', menuType: 'modal', param: 'entMotorista' },
              { nome: 'Controle de Entrada', icone: 'local_shipping', menuType: 'layer', param: 'Main' },
            ],
            tabela: [
              { nome: 'Detalhes', dataType: 'button', func: 'historico', icone: 'access_time', status: 'warning' },
              { nome: 'Senha', field: 'numero' },
              { nome: 'Tipo', field: 'op' },
              { nome: 'Status', field: 'stat', status: 'status' },
              { nome: 'Transportadora', field: 'transp' },
              { nome: 'Nome', field: 'nome' },
              { nome: 'CPF', field: 'cpf', hide: true },
              { nome: 'Telefone', field: 'telefone', hide: true },
              { nome: 'Tipo Veiculo', field: 'tipoCaminhao', hide: true },
              { nome: 'Data', field: 'dEntrada' },
              { nome: 'Hora', field: 'hSaida' },
            ],
            pedestres: [
              { nome: 'Nome', field: 'nome' },
              { nome: 'Tipo', field: 'tipo', },
              { nome: 'Status', field: 'stat', status: 'status' },
              { nome: 'Hora Entrada', field: 'hEntrada' },
              { nome: 'Hora Saida', field: 'hSaida' },
            ]
          },
          componentes: [
            { dataType: 'table', table: 'tabela', id: 'tabela', size: '7', toheader: true, height: '100%', time: true, build: true },
            { dataType: 'table', table: 'pedestres', id: 'pedestres', size: '5', toheader: true, height: '100%', time: true, build: true },

          ],
          funcs: {
            boot: function (tools) {
              console.log('teste')

              tools.getComponente(tools, 'id', 'tabela').ajuste();
              tools.getComponente(tools, 'id', 'pedestres').ajuste();

            },
            header: function (tools, value) {
              if (value == 'Entrada') { QUERY.op = 'Entrada' }
              if (value == 'Saída') { QUERY.op = 'Saída' }
              if (value == 'Entrada/Saida') { QUERY.op = { $in: ['Entrada', 'Saída'] } }
              // if (value == 'Entrada Recusada') QUERY.op =  }
              tools.$scope.cmdFunc('boot')

            },
            historico: function (tools, idx) {
              var itemId = tools.$scope.load.tabela[idx]._id;
              tools.$scope.cmd('edit', itemId, 'tabela', 'Hist');
            },
          }
        },
        {// Detalhes
          pageId: 'Hist',
          pageType: 'modal',
          params: {
            title: 'Detalhes da Entrada',
            boot: 'boot',
            loadLocal: [
              { model: 'motoristas', data: [] }
            ],
            menu: [
              { nome: 'Fechar', menuType: 'ok', icone: 'close', status: 'grey' },
            ],
            motoristas: [
              { nome: 'Operação', field: 'op', status: 'status' },
              { nome: 'Senha', field: 'numero' },
              { nome: 'Status', field: 'stat', status: 'statusColor' },
              { nome: 'Motorista', field: 'nome' },
              { nome: 'CPF', field: 'cpf', mask: 'CPF' },
              { nome: 'Tipo Caminhão', field: 'tipoCaminhao' },
              // {nome:'Status CNH',field:'vencimentoStatus',status:'vencimentoStatusColor'},
              { nome: 'Transportadora', field: 'transp' },
              { nome: 'Data', field: 'dia' },
              { nome: 'Hora', field: 'hora' },
              // {nome:'Recusar Entrada',dataType:'button',func:'recusar',icone:'report_off',status:'danger'},
              // {nome:'Histórico da Entrada',dataType:'button',func:'historico',icone:'access_time',status:'warning'},
            ],
            model: {
              numero: '',
              cpf: '',
              nome: '',
              op: 'Entrada',
              stat: 'Aguardando Liberação',
              tipo: 'Motorista',
              transp: '',
              hEntrada: HORAAGORA,
              hSaida: '',
              dEntrada: '',
              dSaida: '',
              ativo: true
            }
          },
          componentes: [
            { dataType: 'title', nome: 'Dados Motorista' },
            { dataType: 'ivalid', nome: 'CPF', model: 'cpf', size: '3', mask: 'CPF', block: true },
            { dataType: 'input', nome: 'Nome', model: 'nome', size: '3', block: true },
            { dataType: 'input', nome: 'Transportadora', model: 'transp', size: '3', block: true },
            { dataType: 'input', nome: 'Telefone', model: 'telefone', size: '3', mask: 'TELEFONE', block: true },
            { dataType: 'table', id: 'motoristas', table: 'motoristas', size: '12', height: '500px' }
          ],
          funcs: {
            boot: function (tools) {
              var itemId = tools.$scope.item._id + '';
              var motoristas = [];
              tools.services.getData('regCadPortaria', { '_reg.objId': itemId, ativo: true, tipo: 'Motorista' }, function (result) {
                for (var x1 in result.data) {
                  result.data[x1].order = result.data[x1]._db.time * 1;
                  result.data[x1].dia = new Date(result.data[x1]._db.time).toLocaleDateString('pt-BR');
                  result.data[x1].hora = new Date(result.data[x1]._db.time).toLocaleTimeString('pt-BR');
                  if (result.data[x1].op == 'Entrada') { result.data[x1].status = result.data[x1].stat == 'Aguardando Liberação' ? 'gray' : 'success' }

                  if (result.data[x1].op == 'Em Trânsito') { result.data[x1].status = result.data[x1].stat == 'Em Trânsito' ? 'warning' : 'primary' }

                  if (result.data[x1].op == 'Em Doca' && result.data[x1].stat == 'Em Processo') { result.data[x1].status = 'gray' }
                  if (result.data[x1].op == 'Em Doca' && result.data[x1].stat == 'Processo Finalizado') { result.data[x1].status = 'success' }

                  if (result.data[x1].op == 'Saída') { result.data[x1].status = 'primary' }
                  if (result.data[x1].stat == 'Entrada Recusada') { result.data[x1].status = 'danger' }
                  motoristas.push(angular.copy(tools.itemForm(result.data[x1])));
                }
                tools.$scope.load.motoristas = tools.$filter('orderBy')(motoristas, 'order', true);
                tools.getComponente(tools, 'id', 'motoristas').start(tools.$scope.load);
                console.log(motoristas);
              });
            }
          }
        },
        {// entPedestres
          pageId: 'entPedestres',
          pageType: 'modal',
          params: {
            title: 'Entrada de Funcionários',
            boot: 'boot',
            load: [
              {
                base: 'cadFuncionarios', model: 'funcionarios', opt: 'label', trat: function (data) {
                  for (var x1 in data) {
                    console.log('dados', data[x1])
                    data[x1].label = data[x1].nome + ' - ' + data[x1].dados.cargo + ' - ' + data[x1].dados.cpf;
                  }
                  return data;
                }
              },
              { base: 'sysProcesso', model: 'processo', filter: { tipo: 'senha' } },
            ],
            menu: [
              { nome: 'Salvar', menuType: 'func', param: 'tosave', icone: 'save', status: 'success' },
              { nome: 'Cancelar', menuType: 'ok', icone: 'close', status: 'grey' },
            ],
            model: {
              nome: '',
              op: 'Entrada',
              cpf: '',
              tipo: 'Funcionário',
              cargo: '',
              telefone: '',
              ativo: true
            }
          },
          componentes: [
            { dataType: 'title', nome: 'Dados Funcionário' },
            // {dataType:'switchbutton',nome:'Visitante',model:'show',size:'2',click:'setCnh'},
            { dataType: 'typehead', nome: 'Buscar', model: 'label', optionsModel: 'funcionarios', size: '12', mask: 'CPF', change: 'buscarFuncionario' },
            { dataType: 'input', nome: 'Nome', model: 'nome', size: '4', block: true },
            { dataType: 'input', nome: 'Cargo', model: 'cargo', size: '4', block: true },
            { dataType: 'input', nome: 'Telefone', model: 'telefone', size: '4', mask: 'TELEFONE', block: true },
            { dataType: 'input', nome: 'Data Entrada', model: 'dEntrada', size: '6', block: true },
            { dataType: 'input', nome: 'Hora Entrada', model: 'hEntrada', size: '6', block: true },
          ],
          funcs: {
            buscarFuncionario: function (tools) {
              var funcionarios = tools.$scope.load.funcionarios;
              var funcionario = tools.selOpt('funcionarios', 'label', tools.$scope.item.label);
              if (!funcionario) {
                alert('Funcionário não encontrado.'); return
              } else {
                console.log(funcionario);
                tools.$scope.item.idFunc = funcionario._id + '';
                tools.$scope.item.nome = funcionario.nome + '';
                tools.$scope.item.cargo = funcionario['dados.cargo'] + '';
                tools.$scope.item.telefone = funcionario['dados.telefone'] + '';
                tools.$scope.item.cpf = funcionario['dados.cpf'] + '';
                tools.$scope.item.dEntrada = new Date().toLocaleDateString('pt-br')
                tools.$scope.item.hEntrada = new Date().toLocaleTimeString('pt-br')
                tools.$scope.item.stat = 'Entrada'
                tools.$scope.item.status = 'success'
              }
            },
            tosave: function (tools) {
              if (!tools.$scope.item.idFunc || tools.$scope.item.idFunc == '') { alert('Selecione um funcionário.'); return }
              tools.$scope.cmd('save', { base: 'cadPortPedestres', layout: 'Main' });
            }
          }
        },
        {// entVisitantes
          pageId: 'entVisitantes',
          pageType: 'modal',
          params: {
            title: 'Entrada de Visitantes',
            boot: 'boot',
            load: [
              {
                base: 'cadFuncionarios', model: 'funcionarios', opt: 'label', trat: function (data) {
                  for (var x1 in data) {
                    data[x1].label = data[x1].nome + ' - ' + data[x1].dados.cargo + ' - ' + data[x1].dados.cpf;
                  }
                  return data;
                }
              },
            ],
            menu: [
              { nome: 'Salvar', menuType: 'func', param: 'tosave', icone: 'save', status: 'success' },
              { nome: 'Cancelar', menuType: 'ok', icone: 'close', status: 'grey' },
            ],
            model: {
              nome: '',
              cpf: '',
              telefone: '',
              op: 'Entrada',
              tipo: 'Visitante',
              dEntrada: DIAHOJE,
              hEntrada: HORAAGORA,
              ativo: true
            }
          },
          componentes: [
            { dataType: 'title', nome: 'Dados Visitantes' },
            { dataType: 'input', nome: 'Nome', model: 'nome', size: '4' },
            { dataType: 'input', nome: 'CPF', model: 'cpf', size: '4', mask: 'CPF' },
            { dataType: 'input', nome: 'Telefone', model: 'telefone', size: '4', mask: 'TELEFONE' },
            { dataType: 'input', nome: 'Data Entrada', model: 'dEntrada', size: '6', block: true },
            { dataType: 'input', nome: 'Hora Entrada', model: 'hEntrada', size: '6', block: true },
            { dataType: 'title', nome: 'Funcionário Responsável' },
            { dataType: 'typehead', nome: 'Buscar', model: 'label', optionsModel: 'funcionarios', size: '12', mask: 'CPF', change: 'buscarFuncionario' },
          ],
          funcs: {
            buscarFuncionario: function (tools) {
              var funcionarios = tools.$scope.load.funcionarios;
              var funcionario = tools.selOpt('funcionarios', 'label', tools.$scope.item.label);
              if (!funcionario) {
                alert('Funcionário não encontrado.'); return
              } else {
                console.log(funcionario);
                tools.$scope.item.idFunc = funcionario._id + '';
                tools.$scope.item.nomeFunc = funcionario.nome + '';
              }
            },
            tosave: function (tools) {
              if (tools.$scope.item.nome == '') { alert('Insira o nome do visitante.'); return }
              if (tools.$scope.item.cpf.length != 11) { alert('Insira um CPF válido.'); return }
              if (!tools.$scope.item.idFunc || tools.$scope.item.idFunc == '') { alert('Selecione um funcionário.'); return }
              tools.$scope.item.stat = 'Entrada'
              tools.$scope.item.status = 'success'
              tools.$scope.cmd('save', { base: 'cadPortPedestres', layout: 'Main' });
            }
          }
        }
      ]
    }
  }
}())
