<?php

namespace App\Twig;

use App\Navcoin\Block\Entity\BlockCycle;
use App\Navcoin\CommunityFund\Entity\PaymentRequest;
use App\Navcoin\CommunityFund\Entity\Proposal;
use App\Navcoin\CommunityFund\Entity\Voter;
use App\Navcoin\CommunityFund\Constants\ProposalState;
use App\Navcoin\CommunityFund\Constants\PaymentRequestState;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;

class ProposalExtension extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('proposalVoteProgress', [$this, 'getProposalVoteProgress'], ['is_safe' => ['html']]),
            new TwigFunction('proposalVoteProgressParticipation', [$this, 'getProposalVoteProgressParticipation'], ['is_safe' => ['html']]),
            new TwigFunction('paymentRequestVoteProgress', [$this, 'getPaymentRequestVoteProgress'], ['is_safe' => ['html']]),
            new TwigFunction('paymentRequestVoteProgressParticipation', [$this, 'getPaymentRequestVoteProgressParticipation'], ['is_safe' => ['html']]),
        ];
    }

    public function getFilters(): array
    {
        return array(
            new TwigFilter('proposalState', [$this, 'getProposalStateTitle'], ['is_safe' => ['html']]),
        );
    }

    public function getProposalVoteProgress(Proposal $proposal, BlockCycle $blockCycle): string
    {
        $size = $proposal->getVotesYes() + $proposal->getVotesNo() + $proposal->getVotesAbs();
        return '
<div class="progress">
    '.$this->getProgressBar($size, $this->getProgressBarClass($proposal->getStatus(), "yes"), $proposal->getVotesYes()).'
    '.$this->getProgressBar($size, $this->getProgressBarClass($proposal->getStatus(), "no"), $proposal->getVotesNo()).'
    '.$this->getProgressBar($size, $this->getProgressBarClass($proposal->getStatus(), "abs"), $proposal->getVotesAbs()).'
</div>';
    }

    public function getProposalVoteProgressParticipation(Proposal $proposal, BlockCycle $blockCycle): string
    {
        $votes = $proposal->getVotesYes() + $proposal->getVotesNo() + $proposal->getVotesAbs();
        $size = ($proposal->getState() == ProposalState::PENDING ? $blockCycle->getIndex() : $blockCycle->getSize()) - $proposal->getVotesExcluded();
        return '
<div class="progress">
    '.$this->getProgressBar($size, $this->getProgressBarClass($proposal->getStatus(), "yes"), $votes).'
</div>';
    }

    public function getPaymentRequestVoteProgress(PaymentRequest $paymentRequest, BlockCycle $blockCycle): string
    {
        $size = $paymentRequest->getVotesYes() + $paymentRequest->getVotesNo() + $paymentRequest->getVotesAbs();
        return "
<div class=\"progress\">
    " . $this->getProgressBar($size, $this->getProgressBarClass($paymentRequest->getStatus(), "yes"), $paymentRequest->getVotesYes()) . "
    " . $this->getProgressBar($size, $this->getProgressBarClass($paymentRequest->getStatus(), "no"), $paymentRequest->getVotesNo()) . "
    " . $this->getProgressBar($size, $this->getProgressBarClass($paymentRequest->getStatus(), "abs"), $paymentRequest->getVotesAbs(), false) . "
</div>";
    }

    public function getPaymentRequestVoteProgressParticipation(PaymentRequest $paymentRequest, BlockCycle $blockCycle): string
    {
        $votes = $paymentRequest->getVotesYes() + $paymentRequest->getVotesNo() + $paymentRequest->getVotesAbs();
        $size = ($paymentRequest->getState() == PaymentRequestState::PENDING ? $blockCycle->getIndex() : $blockCycle->getSize()) - $paymentRequest->getVotesExcluded();
        return "
<div class=\"progress\">
    " . $this->getProgressBar($size, $this->getProgressBarClass($paymentRequest->getStatus(), "yes"), $votes) . "
</div>";
    }

    public function getProposalStateTitle(String $state): string
    {
        return preg_replace('/(-|_)/', ' ', $state);
    }

    private function getProgressBar(int $size, string $classes, int $votes, bool $showPercent = true): string
    {
        $votesPercent = 0;
        $votesPercentRounded = 0;
        if ($size > 0) {
            $votesPercent = ($votes / $size) * 100;
            $votesPercentRounded = round($votesPercent);
        }
        return sprintf(
            '<div class="%s" role="progressbar" style="%s" aria-valuenow="%d" aria-valuemin="0" aria-valuemax="100">%s</div>',
            $classes,
            sprintf('width: %s&percnt;', $votesPercent),
            $votes,
            ($showPercent && $votesPercent > 9 ? sprintf('%s&percnt;', $votesPercentRounded) : null)
        );
    }

    private function getProgressBarClass(String $state, ?string $vote): string
    {
        $classes = ['progress-bar'];

        if ($vote === "yes") {
            array_push($classes, 'bg-success');
        } elseif ($vote === "no") {
            array_push($classes, 'bg-danger');
        } elseif ($vote === "abs") {
            array_push($classes, 'bg-abstain');
        } else {
            array_push($classes, 'bg-grey');
        }

        if ($state == 'pending') {
            $classes[] = 'progress-bar-striped';
            $classes[] = 'progress-bar-animated';
        }

        return implode(' ', $classes);
    }
}
