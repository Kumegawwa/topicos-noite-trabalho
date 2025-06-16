using System;
using System.ComponentModel.DataAnnotations; // Necessário para usar Data Annotations para validação.

namespace Api.Models
{
    // A classe Aluno representa a entidade Aluno no sistema e mapeia para uma tabela no banco de dados.
    public class Aluno
    {
        // Id é a chave primária da entidade Aluno.
        // Entity Framework Core detecta automaticamente a propriedade 'Id' como chave primária por convenção.
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome do aluno é obrigatório.")] // Garante que o campo Nome não seja nulo ou vazio.
        [StringLength(100, MinimumLength = 3, ErrorMessage = "O nome deve ter entre 3 e 100 caracteres.")] // Define o comprimento mínimo e máximo para o nome.
        public string Nome { get; set; } // Nome completo do aluno.

        [Required(ErrorMessage = "O email do aluno é obrigatório.")] // Garante que o campo Email não seja nulo ou vazio.
        [EmailAddress(ErrorMessage = "O formato do email é inválido.")] // Valida o formato do email.
        [StringLength(100, ErrorMessage = "O email não pode exceder 100 caracteres.")] // Define o comprimento máximo para o email.
        public string Email { get; set; } // Endereço de email do aluno.

        [Required(ErrorMessage = "A data de nascimento é obrigatória.")] // Garante que a data de nascimento seja fornecida.
        [DataType(DataType.Date)] // Indica que esta propriedade deve ser tratada como uma data (sem informações de tempo).
        // A validação de idade mínima/máxima poderia ser adicionada aqui, se fosse uma regra de negócio específica.
        public DateTime DataNascimento { get; set; } // Data de nascimento do aluno.

        [Required(ErrorMessage = "A matrícula é obrigatória.")] // Garante que o campo Matrícula não seja nulo ou vazio.
        [RegularExpression("^[0-9]+$", ErrorMessage = "A matrícula deve conter apenas números.")] // Regex para garantir que a matrícula contenha apenas números.
        [StringLength(20, ErrorMessage = "A matrícula não pode exceder 20 caracteres.")] // Define o comprimento máximo para a matrícula.
        public string Matricula { get; set; } // Número de matrícula do aluno.
    }
}